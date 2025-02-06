import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentFormProps {
  onComplete?: () => void;
}

export const PaymentForm = ({ onComplete }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
    setIsReady(true);
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !isReady) {
      toast.error("Payment system is not ready");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting payment form...");
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      console.log("Confirming setup...");
      const { error: setupError } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet`,
        },
      });

      if (setupError) {
        throw setupError;
      }

      console.log("Card added successfully");
      toast.success("Card added successfully");
      onComplete?.();
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add card";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stripe || !elements || !isReady) {
    return <div className="p-4 text-center text-gray-500">Loading payment form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />
      <Button 
        type="submit"
        disabled={isLoading || !isReady} 
        className="w-full"
      >
        {isLoading ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
};