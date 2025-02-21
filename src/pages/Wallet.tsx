
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Wallet as WalletIcon, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { AddCard } from "@/components/wallet/AddCard";
import { SavedCards } from "@/components/wallet/SavedCards";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Wallet = () => {
  const { session, user } = useAuth();
  const [firstName, setFirstName] = useState<string>('there');
  const [balance, setBalance] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, withdrawals(*)')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const firstWord = data.full_name?.split(' ')[0] || 'there';
          setFirstName(firstWord);
          setProfile(data);
          setBalance(data.wallet_balance || 0);
          setWithdrawals(data.withdrawals || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load wallet information');
      }
    };

    fetchProfile();
  }, [user]);

  const handleCreateConnectAccount = async () => {
    if (!session?.access_token) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating connect account:', error);
      toast.error('Failed to set up withdrawal account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!session?.access_token || !withdrawAmount) return;

    try {
      setIsLoading(true);
      const amount = parseFloat(withdrawAmount);

      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      const { data, error } = await supabase.functions.invoke('process-withdrawal', {
        body: { amount },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;

      toast.success('Withdrawal processed successfully');
      setIsWithdrawDialogOpen(false);
      setWithdrawAmount("");
      
      // Refresh profile to get updated balance
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*, withdrawals(*)')
        .eq('id', user.id)
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile);
        setBalance(updatedProfile.wallet_balance || 0);
        setWithdrawals(updatedProfile.withdrawals || []);
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error(error.message || 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.access_token) {
    return (
      <div className="min-h-screen bg-white pb-16">
        <div className="p-4 pt-16">
          <Card className="p-4">
            <p className="text-center text-gray-500">Please log in to access your wallet</p>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <div className="p-4 pt-16 space-y-6 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-medium text-gray-800">
            Hey <Link to="/profile" className="text-primary hover:underline">{firstName}</Link>,
          </h1>
          <p className="text-gray-600">here's your balance</p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white backdrop-blur-lg border border-white/10 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Balance</h2>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
            <p className="text-sm opacity-80">Available balance</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="p-4 text-center cursor-pointer hover:bg-white/80 transition-colors backdrop-blur-lg border border-gray-200/20 shadow-lg"
            onClick={() => {/* Add funds handler */}}
          >
            <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">Add Funds</p>
          </Card>

          <Card 
            className="p-4 text-center cursor-pointer hover:bg-white/80 transition-colors backdrop-blur-lg border border-gray-200/20 shadow-lg"
            onClick={() => {
              if (!profile?.stripe_connect_account_id) {
                handleCreateConnectAccount();
              } else {
                setIsWithdrawDialogOpen(true);
              }
            }}
          >
            <Download className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium">
              {!profile?.stripe_connect_account_id ? 'Set Up Withdrawals' : 'Withdraw'}
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <Card className="backdrop-blur-lg border border-gray-200/20 shadow-lg">
            <SavedCards />
          </Card>
          <AddCard />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Card className="divide-y divide-gray-100 backdrop-blur-lg border border-gray-200/20 shadow-lg">
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Withdrawal</p>
                      <p className="text-sm text-gray-500">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-medium ${withdrawal.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                      -${withdrawal.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4">
                <p className="text-center text-gray-500">No recent transactions</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount you wish to withdraw to your bank account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Amount</label>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                max={balance}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleWithdraw}
              disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance}
            >
              {isLoading ? 'Processing...' : 'Withdraw Funds'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Wallet;
