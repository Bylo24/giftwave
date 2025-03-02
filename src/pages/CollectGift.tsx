
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GiftRevealAnimation } from "@/components/gift/GiftRevealAnimation";
import { GiftVerificationForm } from "@/components/gift/GiftVerificationForm";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { toast } from "sonner";

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

  const handleAnimationComplete = async () => {
    if (isReplay) {
      navigate('/my-gifts');
      return;
    }

    // Check if there's a pending collector ID
    const pendingCollectorId = sessionStorage.getItem('pendingCollectorId');
    if (pendingCollectorId && gift) {
      try {
        // Get current wallet balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', pendingCollectorId)
          .single();

        const currentBalance = profile?.wallet_balance || 0;
        const newBalance = currentBalance + gift.amount;

        // Update gift status
        const { error: updateGiftError } = await supabase
          .from('gifts')
          .update({
            status: 'collected',
            collector_id: pendingCollectorId,
            collected_at: new Date().toISOString(),
            collection_status: 'completed'
          })
          .eq('id', gift.id)
          .eq('status', 'pending');

        if (updateGiftError) throw updateGiftError;

        // Update wallet balance
        const { error: balanceError } = await supabase
          .from('profiles')
          .upsert({
            id: pendingCollectorId,
            wallet_balance: newBalance
          });

        if (balanceError) throw balanceError;

        toast.success("Gift collected successfully!");
        sessionStorage.removeItem('pendingCollectorId');
        navigate('/download-app');
      } catch (error: any) {
        console.error('Error collecting gift:', error);
        toast.error("Failed to collect gift. Please try again.");
        setIsAnimationComplete(true); // Show verification form as fallback
      }
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
      <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] via-[#9b87f5] to-[#D6BCFA]">
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
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] via-[#9b87f5] to-[#D6BCFA] flex items-center justify-center p-4">
      <GiftVerificationForm giftToken={gift.token} />
    </div>
  );
};

export default CollectGift;
