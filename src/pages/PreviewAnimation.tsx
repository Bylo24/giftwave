
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { GiftLoadingState } from "@/components/gift/GiftLoadingState";
import { GiftNotFound } from "@/components/gift/GiftNotFound";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { GiftPreviewNavigation } from "@/components/gift/GiftPreviewNavigation";
import { GiftPreviewCard } from "@/components/gift/GiftPreviewCard";

const PreviewAnimation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const token = new URLSearchParams(location.search).get('token');
  const { giftDesign, isLoading, createGiftDesign } = useGiftDesign(token);

  // Format memories to ensure they have the correct structure
  const formattedMemories = giftDesign?.memories 
    ? (giftDesign.memories as any[]).map(memory => ({
        id: memory.id || crypto.randomUUID(),
        imageUrl: memory.imageUrl,
        caption: memory.caption,
        date: new Date(memory.date || Date.now())
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
              "No gift design found. Click below to start creating a new gift." :
              "Please log in to create and view gift designs."
            }
          </p>
          {user && (
            <Button 
              onClick={() => createGiftDesign.mutate()}
              className="mt-4"
            >
              Create New Gift
            </Button>
          )}
        </div>
      </PageContainer>
    );
  }

  const incompleteSteps = {
    frontCard: !giftDesign.theme || !giftDesign.front_card_pattern,
    message: !giftDesign.message_video_url,
    memories: !giftDesign.memories || !Array.isArray(giftDesign.memories) || giftDesign.memories.length === 0,
    amount: !giftDesign.selected_amount
  };

  return (
    <PageContainer>
      <PageHeader title="Your Gift Preview" />
      
      <GiftPreviewNavigation 
        giftId={giftDesign.id} 
        token={giftDesign.token}
        incompleteSteps={incompleteSteps} 
      />

      <div className="flex justify-center items-center min-h-[600px] bg-gradient-to-br from-purple-50 to-pink-50 p-4" data-testid="animation-container">
        <GiftPreviewCard
          messageVideo={giftDesign.message_video_url}
          amount={giftDesign.selected_amount?.toString() || "0"}
          memories={formattedMemories}
        />
      </div>

      {(incompleteSteps.frontCard || incompleteSteps.message || incompleteSteps.memories) && (
        <div className="mt-6 text-center text-gray-600">
          <p>Please complete all required sections above to finalize your gift.</p>
        </div>
      )}
    </PageContainer>
  );
};

export default PreviewAnimation;
