
import { Building2 } from "lucide-react";
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
import { BankDetails, WithdrawalMethod } from "@/types/wallet";

interface WithdrawalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawalMethod: WithdrawalMethod;
  setWithdrawalMethod: (method: WithdrawalMethod) => void;
  bankDetails: BankDetails;
  setBankDetails: (details: BankDetails) => void;
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
  bankDetails,
  setBankDetails,
  onWithdraw,
  isLoading,
  balance
}: WithdrawalDialogProps) => {
  const renderBankForm = () => {
    if (withdrawalMethod === 'bank') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
            <Input
              type="text"
              value={bankDetails.accountHolderName}
              onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
              placeholder="Full name on account"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Account Type</label>
            <Select
              value={bankDetails.accountType}
              onValueChange={(value: 'checking' | 'savings') => 
                setBankDetails({ ...bankDetails, accountType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Routing Number</label>
            <Input
              type="text"
              value={bankDetails.routingNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
              placeholder="9 digit routing number"
              maxLength={9}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Account Number</label>
            <Input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              placeholder="Account number"
            />
          </div>
        </div>
      );
    }
    return null;
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
              onValueChange={(value: WithdrawalMethod) => setWithdrawalMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Bank Account (2-3 business days)</span>
                  </div>
                </SelectItem>
                <SelectItem value="paypal">PayPal (Instant)</SelectItem>
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

          {renderBankForm()}

          <Button 
            className="w-full"
            onClick={onWithdraw}
            disabled={
              isLoading || 
              !withdrawAmount || 
              parseFloat(withdrawAmount) <= 0 || 
              parseFloat(withdrawAmount) > balance ||
              (withdrawalMethod === 'bank' && (
                !bankDetails.accountHolderName ||
                !bankDetails.accountNumber ||
                !bankDetails.routingNumber
              ))
            }
          >
            {isLoading ? 'Processing...' : 'Withdraw Funds'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
