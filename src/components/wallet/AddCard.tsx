
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AddCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCard = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log("Creating setup session...");
      
      const { data, error } = await supabase.functions.invoke('create-setup-session', {
        body: {
          success_url: `${window.location.origin}/wallet`,
          cancel_url: `${window.location.origin}/wallet`,
        }
      });
      
      if (error) {
        console.error("Setup session error:", error);
        throw error;
      }
      
      if (!data?.url) {
        throw new Error("No checkout URL received");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Add card error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize card setup";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleAddCard}
        disabled={isLoading}
      >
        <Plus className="w-4 h-4 mr-2" />
        {isLoading ? "Initializing..." : "Add New Card"}
      </Button>
    </Card>
  );
};
