
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PresetAmountButtons } from "./amount/PresetAmountButtons";
import { AmountInput } from "./amount/AmountInput";
import { useGiftAmount } from "@/hooks/useGiftAmount";

interface AmountStepProps {
  amount: string;
  setAmount: (value: string) => void;
  onNext: () => Promise<void>;
}

export const AmountStep = ({ amount, setAmount, onNext }: AmountStepProps) => {
  const presetAmounts = [5, 10, 20, 50, 100, 200];
  const { updateGiftDesign, handleSubmit } = useGiftAmount(amount, onNext);

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === "") {
      setAmount("");
    } else if (numValue <= 0) {
      toast.error("Please enter an amount greater than $0");
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
        toast.error("Please enter a valid amount greater than $0");
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold text-white drop-shadow-md">
          Gift Amount
        </h2>
        <p className="text-white/90 drop-shadow">
          Choose how much you'd like to send
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-white shadow-lg border-0">
          <AmountInput 
            amount={amount}
            onChange={handleAmountChange}
          />

          <PresetAmountButtons
            selectedAmount={amount}
            onAmountSelect={setAmount}
            presetAmounts={presetAmounts}
          />

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
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0 || updateGiftDesign.isPending}
          className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {updateGiftDesign.isPending ? "Creating..." : "Continue"}
        </Button>
      </motion.div>
    </div>
  );
};
