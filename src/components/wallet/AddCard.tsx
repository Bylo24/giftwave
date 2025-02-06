import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { stripePromise } from "@/config/stripe";
import { PaymentForm } from "./PaymentForm";

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
          <PaymentForm />
        </Elements>
      ) : null}
    </Card>
  );
};