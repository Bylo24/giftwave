
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GiftDesign } from "./useGiftDesign";

export const useGiftPayment = () => {
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

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
      const loadingToast = toast.loading("Preparing payment...");

      const { data: response, error: paymentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: { 
            giftId: giftDesign.id,
            token: token,
            amount: giftDesign.selected_amount,
          }
        }
      );

      toast.dismiss(loadingToast);

      if (paymentError || !response?.clientSecret) {
        console.error('Payment error:', paymentError, response);
        toast.error("Failed to initialize payment");
        return;
      }

      setClientSecret(response.clientSecret);
      setIsPaymentModalOpen(true);

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error("Failed to start payment process");
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    navigate('/payment-success');
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return {
    handleProceedToPayment,
    isPaymentModalOpen,
    clientSecret,
    handlePaymentSuccess,
    handleClosePaymentModal
  };
};
