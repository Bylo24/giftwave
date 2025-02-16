
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GiftPreviewAnimation } from "@/components/gift/GiftPreviewAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Gift {
  id: string;
  amount: string;
  message_video_url: string;
  memories: Array<{
    id: string;
    imageUrl?: string;
    caption: string;
    date: Date;
  }>;
  theme: string;
  recipient_phone: string;
  sender_id: string;
  created_at: string;
  updated_at: string;
}

const TestAnimation = () => {
  const [currentFlip, setCurrentFlip] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const giftId = new URLSearchParams(location.search).get('id');

  const { data: giftDesign, isLoading } = useQuery({
    queryKey: ['gift-design', giftId],
    queryFn: async () => {
      if (!giftId) throw new Error("No gift ID provided");

      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('id', giftId)
        .single();

      if (error) {
        console.error("Error fetching gift:", error);
        toast.error("Failed to load gift preview");
        throw error;
      }

      return data as Gift;
    },
    enabled: Boolean(giftId && user),
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
            Gift not found or you don't have permission to view it.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Your Gift Preview" />
      <div className="flex justify-center items-center min-h-[600px] bg-gradient-to-br from-purple-50 to-pink-50 p-4" data-testid="animation-container">
        <div className="relative flex items-center">
          <Button 
            onClick={() => flipCard('left')} 
            className="absolute -left-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
            aria-label="Flip left"
          >
            <ChevronLeft size={30} />
          </Button>

          <div className="perspective-[1000px]">
            <div 
              onClick={handleCardClick}
              className="w-[300px] h-[400px] transform-style-3d transition-transform duration-1000 cursor-pointer"
              style={{ transform: `rotateY(${currentFlip * -180}deg)` }}
            >
              <div className="absolute w-full h-full backface-hidden">
                <GiftPreviewAnimation
                  messageVideo={giftDesign.message_video_url}
                  messageVideoType="url"
                  amount={giftDesign.amount}
                  memories={giftDesign.memories}
                  onComplete={() => {}}
                />
              </div>
              
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-xl font-bold text-white rotate-y-180 rounded-lg shadow-xl">
                <span className="text-4xl mb-2">Amount</span>
                <span className="text-6xl">${giftDesign.amount}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => flipCard('right')} 
            className="absolute -right-16 text-3xl text-gray-700 hover:text-gray-900 transition-colors cursor-pointer z-10"
            aria-label="Flip right"
          >
            <ChevronRight size={30} />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default TestAnimation;
