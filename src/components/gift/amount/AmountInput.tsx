
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface AmountInputProps {
  amount: string;
  onChange: (value: string) => void;
}

export const AmountInput = ({ amount, onChange }: AmountInputProps) => {
  return (
    <div className="relative">
      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="number"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        min="0.01"
        step="0.01"
        className="pl-12 h-14 text-lg font-medium border-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="Enter amount"
      />
    </div>
  );
};
