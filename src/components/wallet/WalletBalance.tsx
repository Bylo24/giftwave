
import { Card } from "@/components/ui/card";
import { Wallet as WalletIcon } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
}

export const WalletBalance = ({ balance }: WalletBalanceProps) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-full">
          <WalletIcon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-medium">Your Balance</h2>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold">${balance.toFixed(2)}</p>
        <p className="text-sm opacity-80">Available balance</p>
      </div>
    </Card>
  );
};
