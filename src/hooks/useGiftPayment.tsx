
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GiftDesign } from "./useGiftDesign";

export const useGiftPayment = () => {
  const navigate = useNavigate();

  const handleProceedToPayment = async (token: string | null, giftDesign: GiftDesign | null) => {
    if (!token || !giftDesign) {
      return;
    }

    if (!giftDesign.selected_amount || giftDesign.selected_amount <= 0) {
      navigate(`/select-amount?token=${token}`);
      return;
    }

    try {
      const { data: response, error: checkoutError } = await supabase.functions.invoke(
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

      if (checkoutError || !response?.url) {
        console.error('Checkout error:', checkoutError, response);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = response.url;

    } catch (error) {
      console.error('Payment initiation error:', error);
    }
  };

  return { handleProceedToPayment };
};
