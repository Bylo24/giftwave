
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PreviewStep } from "@/components/gift/PreviewStep";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";

const PreviewGiftContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { user } = useAuth();

  const { data: giftDesign } = useQuery({
    queryKey: ['gift-design', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');
      
      const { data, error } = await supabase
        .from('gift_designs')
        .select('*')
        .eq('token', token)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token
  });

  const handlePayment = async () => {
    if (!giftDesign) {
      toast.error("Gift design not found");
      return;
    }

    try {
      // Create gift record if it doesn't exist
      const { data: gift, error: giftError } = await supabase
        .from('gifts')
        .insert({
          sender_id: user?.id,
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

  return (
    <PageContainer>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <PreviewStep 
            theme={giftDesign?.theme || "birthday"}
            phoneNumber=""
            amount={giftDesign?.selected_amount?.toString() || ""}
            messageVideo={null}
            memory={{
              caption: "",
              date: new Date()
            }}
            memories={giftDesign?.memories || []}
            onNext={handlePayment}
          />
        </div>
      </div>
    </PageContainer>
  );
};

const PreviewGift = () => {
  return (
    <ThemeProvider>
      <PreviewGiftContent />
    </ThemeProvider>
  );
};

export default PreviewGift;
