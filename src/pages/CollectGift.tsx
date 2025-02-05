import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { GiftVerificationForm } from "@/components/gift/GiftVerificationForm";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";

const CollectGift = () => {
  const { giftId } = useParams();
  const [searchParams] = useSearchParams();
  const isReplay = searchParams.get('replay') === 'true';
  const navigate = useNavigate();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const { data: gift, isLoading } = useQuery({
    queryKey: ['gift', giftId],
    queryFn: async () => {
      console.log("Fetching gift:", giftId);
      const { data: giftData, error: giftError } = await supabase
        .from('gifts')
        .select(`
          *,
          sender:profiles(full_name)
        `)
        .eq('id', giftId)
        .single();

      if (giftError) {
        console.error("Error fetching gift:", giftError);
        throw giftError;
      }

      // Fetch associated memories
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('gift_memories')
        .select('*')
        .eq('gift_id', giftId);

      if (memoriesError) {
        console.error("Error fetching memories:", memoriesError);
        throw memoriesError;
      }

      // Format memories to match the expected type
      const formattedMemories = memoriesData.map(memory => ({
        id: memory.id,
        imageUrl: memory.image_url,
        caption: memory.caption,
        date: new Date(memory.date)
      }));

      return {
        ...giftData,
        memories: formattedMemories
      };
    },
  });

  const handleAnimationComplete = () => {
    if (isReplay) {
      navigate('/my-gifts');
    } else {
      setIsAnimationComplete(true);
    }
  };

  if (isLoading) {
    return <GiftLoadingState />;
  }

  if (!gift) {
    return <GiftNotFound />;
  }

  if (!isAnimationComplete || isReplay) {
    return (
      <div className="min-h-screen bg-background">
        <GiftRevealAnimation
          messageVideo={gift.message_video_url}
          amount={gift.amount.toString()}
          memories={gift.memories || []}
          onComplete={handleAnimationComplete}
          memory={{
            caption: "",
            date: new Date()
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <GiftVerificationForm />
    </div>
  );
};

export default CollectGift;