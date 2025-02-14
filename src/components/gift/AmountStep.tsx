
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AmountStepProps {
  amount: string;
  setAmount: (value: string) => void;
  onNext: () => void;
}

export const AmountStep = ({ amount, setAmount, onNext }: AmountStepProps) => {
  const presetAmounts = [5, 10, 20, 50, 100, 200];
  const { toast } = useToast();

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
              className="pl-12 h-14 text-lg font-medium border-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
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
          onClick={onNext}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};
