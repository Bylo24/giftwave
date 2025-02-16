
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GiftPreviewAnimation } from "@/components/gift/GiftPreviewAnimation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const TestAnimation = () => {
  const [currentFlip, setCurrentFlip] = useState(0);
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const designId = new URLSearchParams(location.search).get('id');

  // Create a new gift design
  const createGiftDesign = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to create a gift design");
      }

      const { data, error } = await supabase
        .from('gift_designs')
        .insert([{
          user_id: user.id,
          selected_amount: 50,
          memories: [
            {
              id: crypto.randomUUID(),
              imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
              caption: 'Sample Memory',
              date: new Date().toISOString()
            },
            {
              id: crypto.randomUUID(),
              imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
              caption: 'Another Memory',
              date: new Date().toISOString()
            }
          ],
          message_video_url: 'https://example.com/sample-video.mp4', // You should replace this with an actual video URL
          status: 'draft'
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating gift design:", error);
        toast.error("Failed to create gift preview");
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-design'] });
      toast.success("Created new gift design");
    },
  });

  // Fetch the specific gift design or latest one
  const { data: giftDesign, isLoading } = useQuery({
    queryKey: ['gift-design', designId],
    queryFn: async () => {
      console.log("Fetching gift design, id:", designId);
      let query = supabase
        .from('gift_designs')
        .select('*');

      if (designId) {
        query = query.eq('id', designId);
      } else if (user) {
        // If no specific design ID, get the latest one for the current user
        query = query
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
      } else {
        query = query.order('created_at', { ascending: false }).limit(1);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching gift design:", error);
        toast.error("Failed to load gift preview");
        throw error;
      }

      if (!data) {
        console.log("No gift design found");
        return null;
      }

      console.log("Found gift design:", data);
      return data;
    },
    enabled: true,
  });

  const flipCard = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentFlip > 0) {
      setCurrentFlip(prev => prev - 1);
    } else if (direction === 'right' && currentFlip < 1) {
      setCurrentFlip(prev => prev + 1);
    }
  };

  const handleCardClick = () => {
    setCurrentFlip(prev => prev === 0 ? 1 : 0);
  };

  // Format memories from the stored JSON
  const formattedMemories = giftDesign?.memories 
    ? (giftDesign.memories as any[]).map(memory => ({
        id: memory.id || crypto.randomUUID(),
        imageUrl: memory.imageUrl || 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
        caption: memory.caption || 'Beautiful Memory',
        date: new Date(memory.date || new Date())
      }))
    : [];

  if (isLoading) {
    return <GiftLoadingState />;
  }

  if (!giftDesign) {
    return (
      <PageContainer>
        <PageHeader title="Gift Preview" />
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <GiftNotFound />
          <p className="text-center text-gray-600 mt-4">
            {user ? 
              "No gift design found. Click below to create a new test gift." :
              "Please log in to create and view gift designs."
            }
          </p>
          {user && (
            <Button 
              onClick={() => createGiftDesign.mutate()}
              className="mt-4"
            >
              Create Test Gift
            </Button>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Your Gift Preview" />
      <div className="flex justify-center items-center min-h-[600px] bg-gradient-to-br from-purple-50 to-pink-50 p-4" data-testid="animation-container">
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button 
            onClick={() => flipCard('left')} 
            className="absolute -left-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
            aria-label="Flip left"
          >
            <ChevronLeft size={30} />
          </button>

          {/* Card Container */}
          <div className="perspective-[1000px]">
            <div 
              onClick={handleCardClick}
              className="w-[300px] h-[400px] transform-style-3d transition-transform duration-1000 cursor-pointer"
              style={{ transform: `rotateY(${currentFlip * -180}deg)` }}
            >
              {/* Front Side - Gift Animation */}
              <div className="absolute w-full h-full backface-hidden">
                <GiftPreviewAnimation
                  messageVideo={giftDesign.message_video_url || null}
                  messageVideoType="url"
                  amount={giftDesign.selected_amount?.toString() || "0"}
                  memories={formattedMemories}
                  onComplete={() => {}}
                />
              </div>
              
              {/* Back Side - Amount Display */}
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-xl font-bold text-white rotate-y-180 rounded-lg shadow-xl">
                <span className="text-4xl mb-2">Amount</span>
                <span className="text-6xl">${giftDesign.selected_amount || 0}</span>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => flipCard('right')} 
            className="absolute -right-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
            aria-label="Flip right"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default TestAnimation;
