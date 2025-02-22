
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddCard } from "@/components/wallet/AddCard";
import { SavedCards } from "@/components/wallet/SavedCards";
import { WalletBalance } from "@/components/wallet/WalletBalance";
import { WalletActions } from "@/components/wallet/WalletActions";
import { WithdrawalDialog } from "@/components/wallet/WithdrawalDialog";
import { TransactionsList } from "@/components/wallet/TransactionsList";
import { BankDetails, WithdrawalMethod, Withdrawal } from "@/types/wallet";

const Wallet = () => {
  const { session, user } = useAuth();
  const [firstName, setFirstName] = useState<string>('there');
  const [balance, setBalance] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalMethod>('bank');
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking'
  });

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
        body: { 
          amount,
          method: withdrawalMethod,
          ...(withdrawalMethod === 'bank' && { bankDetails })
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;

      toast.success(data.message);
      setIsWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setBankDetails({
        accountHolderName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking'
      });
      
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

        <WalletBalance balance={balance} />
        <WalletActions onWithdraw={() => setIsWithdrawDialogOpen(true)} />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <Card className="backdrop-blur-lg border border-gray-200/20 shadow-lg">
            <SavedCards />
          </Card>
          <AddCard />
        </div>

        <TransactionsList withdrawals={withdrawals} />
      </div>

      <WithdrawalDialog
        isOpen={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        withdrawalMethod={withdrawalMethod}
        setWithdrawalMethod={setWithdrawalMethod}
        bankDetails={bankDetails}
        setBankDetails={setBankDetails}
        onWithdraw={handleWithdraw}
        isLoading={isLoading}
        balance={balance}
      />

      <BottomNav />
    </div>
  );
};

export default Wallet;
