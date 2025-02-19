
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AmountStep } from "@/components/gift/AmountStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SelectAmountContent = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const draftToken = localStorage.getItem('gift_draft_token');

  // Check for existing draft on mount
  useEffect(() => {
    const checkDraft = async () => {
      if (draftToken) {
        const { data, error } = await supabase
          .from('gift_designs')
          .select('*')
          .eq('token', draftToken)
          .single();

        if (error || !data) {
          toast({
            title: "Error",
            description: "Could not find your gift draft. Starting over.",
            variant: "destructive",
          });
          localStorage.removeItem('gift_draft_token');
          navigate('/frontcard');
          return;
        }

        // If amount is already set, use it
        if (data.selected_amount) {
          setAmount(data.selected_amount.toString());
        }
      }
    };

    checkDraft();
  }, [draftToken, navigate, toast]);

  const handleNext = () => {
    // Navigation is handled in AmountStep
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/80 backdrop-blur-lg z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      <div className="min-h-screen pt-20 px-4 pb-4 max-w-md mx-auto">
        <AmountStep 
          amount={amount}
          setAmount={setAmount}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

const SelectAmount = () => {
  return (
    <ThemeProvider>
      <SelectAmountContent />
    </ThemeProvider>
  );
};

export default SelectAmount;
