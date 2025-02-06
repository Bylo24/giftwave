import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PaymentFormProps {
  onComplete?: () => void;
}

export const PaymentForm = ({ onComplete }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Verify stripe is initialized
  useEffect(() => {
    if (!stripe || !elements) {
      console.warn('Stripe or Elements not initialized');
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Payment system not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

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

      toast({
        title: "Success",
        description: "Card added successfully",
      });
      onComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add card";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
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