
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentCard } from "@/components/layout/ContentCard";
import { GiftPreviewAnimation } from "@/components/gift/GiftPreviewAnimation";

const PreviewAnimation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { giftDesign, isLoading } = useGiftDesign(token || null);

  const handleContinueToPayment = async () => {
    if (!giftDesign || !user) {
      toast.error("Gift design not found");
      return;
    }

    try {
      // Create gift record
      const { data: gift, error: giftError } = await supabase
        .from('gifts')
        .insert({
          sender_id: user.id,
          amount: giftDesign.selected_amount,
          theme: giftDesign.theme || 'default',
          status: 'pending',
          token: token
        })
        .select()
        .single();

      if (giftError) throw giftError;

      // Create Stripe checkout session
      const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: { giftId: gift.id }
        }
      );

      if (checkoutError) throw checkoutError;

      // Redirect to Stripe Checkout
      if (sessionData?.sessionUrl) {
        window.location.href = sessionData.sessionUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to initiate payment");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <ContentCard>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading preview...</p>
            </div>
          </ContentCard>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <GiftPreviewAnimation
            messageVideo={giftDesign?.message_video_url || null}
            messageVideoType="url"
            amount={giftDesign?.selected_amount?.toString() || "0"}
            memories={giftDesign?.memories || []}
            onComplete={() => {}}
          />
          <div className="mt-8">
            <Button
              onClick={handleContinueToPayment}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PreviewAnimation;
