import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe has not been initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: setupError } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet`,
        },
      });

      if (setupError) {
        setError(setupError.message);
        toast({
          title: "Error adding card",
          description: setupError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Card added successfully",
        });
      }
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
        onChange={(event) => {
          if (event.complete) {
            setError(null);
          } else if (event.empty) {
            setError("Please enter your card details");
          }
        }}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
};