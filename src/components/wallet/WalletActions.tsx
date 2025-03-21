
import { Card } from "@/components/ui/card";
import { Plus, Download } from "lucide-react";

interface WalletActionsProps {
  onWithdraw: () => void;
}

export const WalletActions = ({ onWithdraw }: WalletActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card 
        className="p-4 text-center cursor-pointer hover-lift glass-card"
        onClick={() => {/* Add funds handler */}}
      >
        <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
        <p className="font-medium">Add Funds</p>
      </Card>

      <Card 
        className="p-4 text-center cursor-pointer hover-lift glass-card"
        onClick={onWithdraw}
      >
        <Download className="h-6 w-6 mx-auto mb-2 text-primary" />
        <p className="font-medium">Withdraw Funds</p>
      </Card>
    </div>
  );
};
