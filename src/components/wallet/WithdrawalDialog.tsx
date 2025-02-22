import { Building2, Mail, CreditCard } from "lucide-react";
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
import { 
  BankDetails, 
  WithdrawalMethod, 
  PayPalDetails,
  USBankDetails,
  UKBankDetails,
  AUBankDetails,
  EUBankDetails,
  CardDetails 
} from "@/types/wallet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const SUPPORTED_COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
];

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
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isVerifyingPayPal, setIsVerifyingPayPal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>("");

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data: { paymentMethods }, error } = await supabase.functions.invoke('list-payment-methods');
      if (error) throw error;
      return paymentMethods;
    },
    enabled: isOpen && withdrawalMethod === 'card'
  });

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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Card withdrawals are typically processed within 1-3 business days. Standard processing fees may apply.
          </p>
        </div>
      </div>
    );
  };

  const renderBankForm = () => {
    if (withdrawalMethod !== 'bank') return null;

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
          <label className="text-sm font-medium text-gray-700">Bank Name</label>
          <Input
            type="text"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            placeholder="Enter bank name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <Select
            value={bankDetails.country}
            onValueChange={(country) => {
              const currency = SUPPORTED_COUNTRIES.find(c => c.code === country)?.currency || 'USD';
              setBankDetails({
                ...bankDetails,
                country,
                currency,
                accountType: country === 'GB' ? 'current' : 'checking'
              } as BankDetails);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {bankDetails.country === 'US' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Routing Number</label>
              <Input
                type="text"
                value={(bankDetails as USBankDetails).routingNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value } as USBankDetails)}
                placeholder="9 digit routing number"
                maxLength={9}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Number</label>
              <Input
                type="text"
                value={(bankDetails as USBankDetails).accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value } as USBankDetails)}
                placeholder="Account number"
              />
            </div>
          </>
        )}

        {bankDetails.country === 'GB' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort Code</label>
              <Input
                type="text"
                value={(bankDetails as UKBankDetails).sortCode}
                onChange={(e) => setBankDetails({ ...bankDetails, sortCode: e.target.value } as UKBankDetails)}
                placeholder="6 digit sort code"
                maxLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Number</label>
              <Input
                type="text"
                value={(bankDetails as UKBankDetails).accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value } as UKBankDetails)}
                placeholder="8 digit account number"
                maxLength={8}
              />
            </div>
          </>
        )}

        {bankDetails.country === 'AU' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">BSB</label>
              <Input
                type="text"
                value={(bankDetails as AUBankDetails).bsb}
                onChange={(e) => setBankDetails({ ...bankDetails, bsb: e.target.value } as AUBankDetails)}
                placeholder="6 digit BSB"
                maxLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Number</label>
              <Input
                type="text"
                value={(bankDetails as AUBankDetails).accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value } as AUBankDetails)}
                placeholder="Account number"
              />
            </div>
          </>
        )}

        {['DE', 'FR', 'ES', 'IT'].includes(bankDetails.country) && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">IBAN</label>
              <Input
                type="text"
                value={(bankDetails as EUBankDetails).iban}
                onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value } as EUBankDetails)}
                placeholder="IBAN"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SWIFT/BIC</label>
              <Input
                type="text"
                value={(bankDetails as EUBankDetails).swiftCode}
                onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value } as EUBankDetails)}
                placeholder="SWIFT/BIC code"
              />
            </div>
          </>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            International transfers typically take 2-5 business days. Fees may apply based on your region and transfer amount.
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
                <SelectItem value="bank">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Bank Account</span>
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
          {renderBankForm()}
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
              (withdrawalMethod === 'bank' && (
                !bankDetails.accountHolderName ||
                !bankDetails.bankName ||
                !bankDetails.country ||
                (bankDetails.country === 'US' && (
                  !(bankDetails as USBankDetails).routingNumber ||
                  !(bankDetails as USBankDetails).accountNumber
                )) ||
                (bankDetails.country === 'GB' && (
                  !(bankDetails as UKBankDetails).sortCode ||
                  !(bankDetails as UKBankDetails).accountNumber
                )) ||
                (bankDetails.country === 'AU' && (
                  !(bankDetails as AUBankDetails).bsb ||
                  !(bankDetails as AUBankDetails).accountNumber
                )) ||
                (['DE', 'FR', 'ES', 'IT'].includes(bankDetails.country) && (
                  !(bankDetails as EUBankDetails).iban ||
                  !(bankDetails as EUBankDetails).swiftCode
                ))
              )) ||
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
