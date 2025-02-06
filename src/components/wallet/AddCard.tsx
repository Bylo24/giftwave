import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { stripePromise } from "@/config/stripe";
import { PaymentForm } from "./PaymentForm";

export const AddCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCard = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-setup-intent');
      
      if (error) {
        throw error;
      }
      
      if (!data?.clientSecret) {
        throw new Error("No client secret received");
      }

      setClientSecret(data.clientSecret);
      setShowForm(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize card setup";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setShowForm(false);
    setClientSecret(null);
  };

  return (
    <Card className="p-4">
      {!showForm ? (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleAddCard}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? "Initializing..." : "Add New Card"}
        </Button>
      ) : clientSecret ? (
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: { theme: 'stripe' },
            loader: 'auto'
          }}
        >
          <PaymentForm onComplete={handlePaymentComplete} />
        </Elements>
      ) : null}
    </Card>
  );
};