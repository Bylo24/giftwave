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

const stripePromise = loadStripe("pk_test_51OxLwkHVfyEGkPVxWXXgbhXXXXXXXXXXXXXXXXXXX");

const AddCardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Card added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
};

export const AddCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleAddCard = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-setup-intent');
      if (error) throw error;
      setClientSecret(data.clientSecret);
      setShowForm(true);
    } catch (error) {
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
          options={{ clientSecret, appearance: { theme: 'stripe' } }}
        >
          <AddCardForm />
        </Elements>
      ) : null}
    </Card>
  );
};