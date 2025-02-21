
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GiftDesign } from "./useGiftDesign";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type PaymentEvent = Database["public"]["Tables"]["payment_events"]["Row"];

export const useGiftPayment = () => {
  const navigate = useNavigate();

  const handleProceedToPayment = async (token: string | null, giftDesign: GiftDesign | null) => {
    if (!token || !giftDesign) {
      toast.error("Missing gift information");
      return;
    }

    if (!giftDesign.selected_amount || giftDesign.selected_amount <= 0) {
      navigate(`/select-amount?token=${token}`);
      return;
    }

    try {
      // Update gift design status to processing payment
      await supabase
        .from('gift_designs')
        .update({ 
          payment_status: 'processing',
          status: 'preview'
        })
        .eq('id', giftDesign.id);

      const { data: response, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: { 
            giftId: giftDesign.id,
            token: token,
            amount: giftDesign.selected_amount,
            returnUrl: `${window.location.origin}/payment-success?token=${token}`
          }
        }
      );

      if (checkoutError || !response?.url) {
        console.error('Checkout error:', checkoutError, response);
        toast.error("Failed to initiate payment");
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = response.url;

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error("Failed to process payment");
    }
  };

  // Hook to track payment status
  const usePaymentStatus = (giftDesignId: string | undefined) => {
    return useQuery({
      queryKey: ['payment-status', giftDesignId],
      queryFn: async () => {
        if (!giftDesignId) throw new Error('No gift design ID provided');
        
        const { data, error } = await supabase
          .from('payment_events')
          .select('*')
          .eq('gift_design_id', giftDesignId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        return data as PaymentEvent;
      },
      enabled: !!giftDesignId,
      refetchInterval: (query) => {
        const data = query.state.data as PaymentEvent | undefined;
        if (!data || ['pending', 'processing'].includes(data.status)) {
          return 5000;
        }
        return false;
      }
    });
  };

  return { 
    handleProceedToPayment,
    usePaymentStatus 
  };
};
