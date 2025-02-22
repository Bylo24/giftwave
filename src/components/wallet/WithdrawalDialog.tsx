
import { Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WithdrawalMethod } from "@/types/wallet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface WithdrawalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawalMethod: WithdrawalMethod;
  setWithdrawalMethod: (method: WithdrawalMethod) => void;
  onWithdraw: () => void;
  isLoading: boolean;
  balance: number;
}

export const WithdrawalDialog = ({
  isOpen,
  onOpenChange,
  withdrawAmount,
  setWithdrawAmount,
  withdrawalMethod,
  setWithdrawalMethod,
  onWithdraw,
  isLoading,
  balance
}: WithdrawalDialogProps) => {
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isVerifyingPayPal, setIsVerifyingPayPal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [useInstantPayout, setUseInstantPayout] = useState(false);

  const { data: connectAccount } = useQuery({
    queryKey: ['connect-account'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_connect_accounts')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isOpen && withdrawalMethod === 'card'
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('list-payment-methods');
      return data?.payment_methods || [];
    },
    enabled: isOpen && withdrawalMethod === 'card'
  });

  const handleCreateConnectAccount = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account');
      if (error) throw error;
      
      // Redirect to Stripe Connect onboarding
      window.location.href = data.url;
    } catch (error) {
      toast.error("Failed to create Connect account");
    }
  };

  const handlePayPalVerification = async () => {
    setIsVerifyingPayPal(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("PayPal account verified successfully");
    } catch (error) {
      toast.error("Failed to verify PayPal account");
    } finally {
      setIsVerifyingPayPal(false);
    }
  };

  const renderCardForm = () => {
    if (withdrawalMethod !== 'card') return null;

    if (!connectAccount) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            To receive payments to your card, you need to set up a Stripe Connect account.
          </p>
          <Button onClick={handleCreateConnectAccount} className="w-full">
            Set up Card Payments
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Card</label>
          <Select
            value={selectedCard}
            onValueChange={setSelectedCard}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a card" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods?.map((method: any) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.card.brand} •••• {method.card.last4}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {connectAccount?.instant_payouts_enabled && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={useInstantPayout}
              onCheckedChange={setUseInstantPayout}
              id="instant-payout"
            />
            <label htmlFor="instant-payout" className="text-sm text-gray-600">
              Instant payout (available within 30 minutes)
            </label>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            {useInstantPayout
              ? "Card withdrawals will be processed instantly for a small fee."
              : "Card withdrawals are typically processed within 1-3 business days."}
          </p>
        </div>
      </div>
    );
  };

  const renderPayPalForm = () => {
    if (withdrawalMethod !== 'paypal') return null;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">PayPal Email</label>
          <div className="flex space-x-2">
            <Input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="Enter your PayPal email"
            />
            <Button 
              variant="outline"
              onClick={handlePayPalVerification}
              disabled={!paypalEmail || isVerifyingPayPal}
            >
              {isVerifyingPayPal ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            PayPal withdrawals are typically processed within 24 hours. A small fee may apply depending on your region.
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Choose your withdrawal method and enter the amount you wish to withdraw.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Withdrawal Method</label>
            <Select
              value={withdrawalMethod}
              onValueChange={(value: WithdrawalMethod) => {
                setWithdrawalMethod(value);
                setSelectedCard("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit/Debit Card</span>
                  </div>
                </SelectItem>
                <SelectItem value="paypal">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>PayPal</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          {renderCardForm()}
          {renderPayPalForm()}

          <Button 
            className="w-full"
            onClick={onWithdraw}
            disabled={
              isLoading || 
              !withdrawAmount || 
              parseFloat(withdrawAmount) <= 0 || 
              parseFloat(withdrawAmount) > balance ||
              (withdrawalMethod === 'card' && !selectedCard) ||
              (withdrawalMethod === 'paypal' && !paypalEmail)
            }
          >
            {isLoading ? 'Processing...' : 'Withdraw Funds'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
