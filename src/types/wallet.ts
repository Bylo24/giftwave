
export type WithdrawalMethod = 'bank' | 'paypal';

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: WithdrawalMethod;
  status: 'pending' | 'completed';
  created_at: string;
}
