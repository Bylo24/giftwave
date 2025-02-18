
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GiftPreviewCard } from "@/components/gift/GiftPreviewCard";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PreviewAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gift, setGift] = useState<any>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const loadGift = async () => {
      try {
        if (!token) {
          setError("Invalid gift token");
          return;
        }

        console.log("Loading gift with token:", token);

        const { data: giftData, error: giftError } = await supabase
          .from('gifts')
          .select(`
            *,
            sender:profiles(full_name),
            gift_memories(*)
          `)
          .eq('token', token)
          .maybeSingle();

        if (giftError) {
          console.error("Error loading gift:", giftError);
          setError("Failed to load gift");
          return;
        }

        console.log("Gift data received:", giftData);

        if (!giftData) {
          console.log("No gift found with token:", token);
          setError("Gift not found");
          return;
        }

        const formattedMemories = giftData.gift_memories?.map((memory: any) => ({
          id: memory.id,
          imageUrl: memory.image_url,
          caption: memory.caption,
          date: new Date(memory.date)
        })) || [];

        console.log("Formatted memories:", formattedMemories);

        setGift({
          ...giftData,
          memories: formattedMemories
        });
      } catch (err) {
        console.error("Error in loadGift:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadGift();
  }, [token]);

  const handleComplete = () => {
    navigate("/collect-gift");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate("/home")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {gift && (
          <GiftRevealAnimation
            messageVideo={gift.message_video_url || ""}
            amount={gift.amount?.toString() || "0"}
            memories={gift.memories}
            memory={gift.memory}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewAnimation;
