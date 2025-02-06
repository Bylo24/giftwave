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
  const [isElementsReady, setIsElementsReady] = useState(false);

  useEffect(() => {
    const checkElements = async () => {
      if (stripe && elements) {
        try {
          // Initialize elements without the loader option
          setIsElementsReady(true);
        } catch (error) {
          console.error('Error initializing elements:', error);
          toast.error('Failed to initialize payment form');
        }
      }
    };

    checkElements();

    return () => {
      setIsElementsReady(false);
    };
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !isElementsReady) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: setupError } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet`,
        },
      });

      if (setupError) {
        throw setupError;
      }

      toast.success("Card added successfully");
      onComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add card";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isElementsReady) {
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
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
};