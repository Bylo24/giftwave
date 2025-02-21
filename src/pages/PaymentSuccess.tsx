
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentCard } from "@/components/layout/ContentCard";
import { useGiftDesign } from "@/hooks/useGiftDesign";
import { useGiftPayment } from "@/hooks/useGiftPayment";
import { Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const { giftDesign } = useGiftDesign(token);
  const { usePaymentStatus } = useGiftPayment();
  const { data: paymentStatus, isLoading } = usePaymentStatus(giftDesign?.id);

  useEffect(() => {
    if (!token) {
      toast.error("Missing payment information");
      navigate("/");
      return;
    }

    if (paymentStatus?.status === 'failed') {
      toast.error("Payment failed. Please try again.");
      navigate("/");
      return;
    }

    if (paymentStatus?.status === 'succeeded') {
      toast.success("Payment successful! Your gift is now active.");
    }
  }, [token, paymentStatus, navigate]);

  if (isLoading || !paymentStatus || paymentStatus.status === 'processing') {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center p-4">
          <ContentCard>
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
              <h2 className="text-xl font-semibold">Processing Payment...</h2>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </div>
          </ContentCard>
        </div>
      </PageContainer>
    );
  }

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
