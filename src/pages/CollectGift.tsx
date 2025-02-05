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
      const { data, error } = await supabase
        .from('gifts')
        .select(`
          *,
          sender:profiles(full_name)
        `)
        .eq('id', giftId)
        .single();

      if (error) {
        console.error("Error fetching gift:", error);
        throw error;
      }

      console.log("Fetched gift:", data);
      return data;
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

  // Show animation for both initial view and replay
  if (!isAnimationComplete || isReplay) {
    return (
      <div className="min-h-screen bg-background">
        <GiftRevealAnimation
          messageVideo={gift.message_video_url}
          amount={gift.amount.toString()}
          memories={[]} // We'll implement memories in a separate update
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