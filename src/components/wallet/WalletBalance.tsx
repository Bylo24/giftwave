
import { Card } from "@/components/ui/card";
import { Wallet as WalletIcon } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
}

export const WalletBalance = ({ balance }: WalletBalanceProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white backdrop-blur-lg border border-white/10 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-full">
          <WalletIcon className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold font-montserrat">Your Balance</h2>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold font-montserrat tracking-tight">${balance.toFixed(2)}</p>
        <p className="text-sm opacity-80 font-montserrat">Available balance</p>
      </div>
    </Card>
  );
};
