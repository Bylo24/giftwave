import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Wallet as WalletIcon, Plus, Download } from "lucide-react";

const Wallet = () => {
  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="p-4 pt-16 space-y-6">
        {/* Balance Card */}
        <Card className="p-6 bg-primary text-white">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">$0.00</p>
            <p className="text-sm opacity-80">Available balance</p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {/* Add funds handler */}}
          >
            <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">Add Funds</p>
          </Card>

          <Card 
            className="p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {/* Deposit handler */}}
          >
            <Download className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">Deposit</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Card className="p-4">
            <p className="text-center text-gray-500">No recent transactions</p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;