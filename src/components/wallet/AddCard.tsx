import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');

const AddCardForm = () => {
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
          if (event.error) {
            setError(event.error.message);
          } else {
            setError(null);
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

export const AddCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const handleAddCard = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-setup-intent');
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      setClientSecret(data.clientSecret);
      setShowForm(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize card setup";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error creating setup intent:', error);
    }
  };

  return (
    <Card className="p-4">
      {!showForm ? (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleAddCard}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Button>
      ) : clientSecret ? (
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret, 
            appearance: { theme: 'stripe' },
          }}
        >
          <AddCardForm />
        </Elements>
      ) : null}
    </Card>
  );
};