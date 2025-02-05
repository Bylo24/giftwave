import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AmountStepProps {
  amount: string;
  setAmount: (value: string) => void;
  onNext: () => void;
}

export const AmountStep = ({ amount, setAmount, onNext }: AmountStepProps) => {
  const presetAmounts = [5, 10, 20, 50, 100, 200];

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-500/10 rounded-full animate-bounce">
          <DollarSign className="h-6 w-6 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Choose Amount
        </h2>
      </div>
      <p className="text-gray-600">How much would you like to gift?</p>
      
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="text-lg border-2 border-green-500/20 focus:border-green-500/40 transition-colors"
      />
      
      <div className="grid grid-cols-3 gap-2">
        {presetAmounts.map((preset) => (
          <Button
            key={preset}
            variant="outline"
            onClick={() => setAmount(preset.toString())}
            className="h-12 hover:bg-green-50 border-2 border-green-500/20 hover:border-green-500/40 transition-colors"
          >
            ${preset}
          </Button>
        ))}
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 transition-opacity"
        onClick={onNext}
        disabled={!amount}
      >
        Continue to Preview
      </Button>
    </Card>
  );
};