
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AmountStepProps {
  amount: string;
  setAmount: (value: string) => void;
  onNext: () => void;
}

export const AmountStep = ({ amount, setAmount, onNext }: AmountStepProps) => {
  const presetAmounts = [5, 10, 20, 50, 100, 200];
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const draftToken = localStorage.getItem('gift_draft_token');

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === "") {
      setAmount("");
    } else if (numValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount greater than $0",
        variant: "destructive",
      });
      setAmount("");
    } else {
      setAmount(value);
    }
  };

  const handleCustomAmountClick = () => {
    const customAmount = prompt("Enter custom amount:");
    if (customAmount) {
      const numAmount = parseFloat(customAmount);
      if (!isNaN(numAmount) && numAmount > 0) {
        setAmount(numAmount.toString());
      } else {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount greater than $0",
          variant: "destructive",
        });
      }
    }
  };

  const validateGiftDesign = async (design: any) => {
    const validationChecks = {
      frontCard: !!(design.front_card_pattern || design.theme),
      insideLeft: !!design.message_video_url,
      insideRight: !!(design.memories && design.memories.length > 0),
      amount: !!(design.selected_amount && design.selected_amount > 0)
    };

    const missingSteps = [];
    if (!validationChecks.frontCard) missingSteps.push("front card design");
    if (!validationChecks.insideLeft) missingSteps.push("video message");
    if (!validationChecks.insideRight) missingSteps.push("photo memories");
    if (!validationChecks.amount) missingSteps.push("gift amount");

    return {
      isValid: Object.values(validationChecks).every(check => check),
      missingSteps
    };
  };

  const updateGiftDesign = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to create a gift design");
      }

      if (!draftToken) {
        toast({
          title: "Error",
          description: "No draft token found. Please start over.",
          variant: "destructive",
        });
        navigate('/frontcard');
        return null;
      }

      // First, verify this token exists and belongs to the current user
      const { data: existingDesign, error: fetchError } = await supabase
        .from('gift_designs')
        .select('*')
        .eq('token', draftToken)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !existingDesign) {
        console.error("Error fetching existing design:", fetchError);
        toast({
          title: "Error",
          description: "Could not find your gift design. Please start over.",
          variant: "destructive",
        });
        navigate('/frontcard');
        return null;
      }

      // Validate all required steps are completed
      const validation = await validateGiftDesign(existingDesign);
      if (!validation.isValid) {
        const firstMissingStep = validation.missingSteps[0];
        const redirectMap = {
          "front card design": '/frontcard',
          "video message": '/insideleftcard',
          "photo memories": '/insiderightcard'
        };
        
        toast({
          title: "Missing information",
          description: `Please complete these steps first: ${validation.missingSteps.join(", ")}`,
          variant: "destructive",
        });
        
        // Navigate to the first missing step
        if (firstMissingStep in redirectMap) {
          navigate(redirectMap[firstMissingStep as keyof typeof redirectMap]);
        }
        return null;
      }

      // Update the gift design with amount and change status to preview
      const { data, error } = await supabase
        .from('gift_designs')
        .update({
          selected_amount: parseFloat(amount),
          status: 'preview',
          last_edited_at: new Date().toISOString()
        })
        .eq('token', draftToken)
        .eq('user_id', user.id) // Extra safety check
        .select()
        .single();

      if (error) {
        console.error("Error updating gift design:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        queryClient.invalidateQueries({ queryKey: ['gift-design'] });
        // Navigate to preview animation with the specific token
        navigate(`/previewanimation?token=${data.token}`);
        toast({
          title: "Success",
          description: "Gift preview ready",
        });
      }
    },
    onError: (error) => {
      console.error("Failed to update gift design:", error);
      toast({
        title: "Error",
        description: "Failed to create gift preview. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleContinue = async () => {
    if (!amount) {
      toast({
        title: "Invalid amount",
        description: "Please select or enter an amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateGiftDesign.mutateAsync();
    } catch (error) {
      console.error("Failed to update gift design:", error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Gift Amount
        </h2>
        <p className="text-gray-500">
          Choose how much you'd like to send
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-white shadow-lg border-0">
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min="0.01"
              step="0.01"
              className="pl-12 h-14 text-lg font-medium border-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter amount"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                onClick={() => setAmount(preset.toString())}
                className={cn(
                  "h-12 border-2 font-medium transition-all",
                  amount === preset.toString()
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "hover:border-blue-200 hover:bg-blue-50/50"
                )}
              >
                ${preset}
              </Button>
            ))}
          </div>

          <div className="mt-3">
            <Button
              variant="outline"
              onClick={handleCustomAmountClick}
              className="w-full h-12 border-2 font-medium hover:border-blue-200 hover:bg-blue-50/50"
            >
              Custom Amount
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button 
          onClick={handleContinue}
          disabled={!amount || parseFloat(amount) <= 0 || updateGiftDesign.isPending}
          className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {updateGiftDesign.isPending ? "Creating..." : "Continue"}
        </Button>
      </motion.div>
    </div>
  );
};
