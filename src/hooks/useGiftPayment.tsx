
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GiftDesign } from "./useGiftDesign";

export const useGiftPayment = () => {
  const navigate = useNavigate();

  const handleProceedToPayment = async (token: string | null, giftDesign: GiftDesign | null) => {
    if (!token || !giftDesign) {
      toast.error("Gift details not found");
      return;
    }

    if (!giftDesign.selected_amount || giftDesign.selected_amount <= 0) {
      toast.error("Please select a gift amount first");
      navigate(`/select-amount?token=${token}`);
      return;
    }

    try {
      const loadingToast = toast.loading("Preparing checkout...");

      const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: { 
            giftId: giftDesign.id,
            token: token,
            amount: giftDesign.selected_amount,
            returnUrl: `${window.location.origin}/payment-success`
          }
        }
      );

      toast.dismiss(loadingToast);

      if (checkoutError || !sessionData?.url) {
        console.error('Checkout error:', checkoutError);
        toast.error("Failed to create checkout session");
        return;
      }

      const { error: updateError } = await supabase
        .from('gift_designs')
        .update({ 
          status: 'preview',
          stripe_session_id: sessionData.sessionId
        })
        .eq('token', token);

      if (updateError) {
        console.error('Status update error:', updateError);
        toast.error("Failed to update gift status");
        return;
      }

      window.location.href = sessionData.url;

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error("Failed to start checkout process");
    }
  };

  return { handleProceedToPayment };
};
