
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentCard } from "@/components/layout/ContentCard";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const token = searchParams.get("token");

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!sessionId || !token) {
        toast.error("Missing payment information");
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "handle-payment-success",
          {
            body: { sessionId, token },
          }
        );

        if (error) throw error;

        toast.success("Payment successful! Your gift is now active.");
        navigate("/my-gifts");
      } catch (error) {
        console.error("Payment confirmation error:", error);
        toast.error("Failed to confirm payment");
        navigate("/");
      }
    };

    handlePaymentSuccess();
  }, [sessionId, token, navigate]);

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center p-4">
        <ContentCard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-2xl font-bold text-green-600">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Your gift payment has been processed and will be activated shortly.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/my-gifts")}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                View My Gifts
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/home")}
                className="w-full"
              >
                Return Home
              </Button>
            </div>
          </motion.div>
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default PaymentSuccess;
