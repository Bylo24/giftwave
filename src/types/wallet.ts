
export type WithdrawalMethod = 'paypal' | 'card';

export interface PayPalDetails {
  email: string;
  verified: boolean;
}

export interface CardDetails {
  paymentMethodId: string;
  last4: string;
  brand: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: WithdrawalMethod;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  paypal_details?: PayPalDetails;
  card_details?: CardDetails;
  currency: string;
}
