
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGift } from "@/contexts/GiftContext";
import { toast } from "sonner";

interface AmountStepProps {
  amount: string;
  setAmount: (amount: string) => void;
  onNext?: () => void;
}

export const AmountStep = ({ amount, setAmount, onNext }: AmountStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, messageVideoUrl, memories, recipientPhone, setGiftId } = useGift();

  const createGift = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in to create a gift");
      if (!amount) throw new Error("Amount is required");

      const { data, error } = await supabase
        .from('gifts')
        .insert([{
          sender_id: user.id,
          recipient_phone: recipientPhone,
          amount,
          theme,
          message_video_url: messageVideoUrl,
          memories,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setGiftId(data.id);
      navigate(`/testanimation?id=${data.id}`);
      toast.success("Gift created successfully!");
    },
    onError: (error) => {
      console.error("Error creating gift:", error);
      toast.error("Failed to create gift. Please try again.");
    }
  });

  const handleNext = async () => {
    if (!amount) {
      toast.error("Please select or enter an amount");
      return;
    }

    setIsProcessing(true);
    try {
      await createGift.mutateAsync();
    } finally {
      setIsProcessing(false);
    }
  };

  const presetAmounts = ["5", "10", "20", "50", "100", "200"];

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Gift Amount</h2>
        <p className="text-gray-600">Choose how much you'd like to send</p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="$ Enter amount"
          value={amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, '');
            setAmount(value);
          }}
          className="text-center text-lg"
        />

        <div className="grid grid-cols-3 gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant={amount === preset ? "default" : "outline"}
              onClick={() => setAmount(preset)}
              className="w-full"
            >
              ${preset}
            </Button>
          ))}
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleNext}
        disabled={!amount || isProcessing}
      >
        {isProcessing ? "Creating gift..." : "Continue"}
      </Button>
    </Card>
  );
};
