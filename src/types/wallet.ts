
export type WithdrawalMethod = 'bank' | 'paypal';

export type BankAccountType = 'checking' | 'savings' | 'current' | 'savings_deposit';

export interface BaseBankDetails {
  accountHolderName: string;
  bankName: string;
  accountType: BankAccountType;
  country: string;
  currency: string;
}

export interface USBankDetails extends BaseBankDetails {
  country: 'US';
  routingNumber: string;
  accountNumber: string;
}

export interface EUBankDetails extends BaseBankDetails {
  country: string;
  iban: string;
  swiftCode: string;
}

export interface UKBankDetails extends BaseBankDetails {
  country: 'GB';
  sortCode: string;
  accountNumber: string;
}

export interface AUBankDetails extends BaseBankDetails {
  country: 'AU';
  bsb: string;
  accountNumber: string;
}

export type BankDetails = USBankDetails | EUBankDetails | UKBankDetails | AUBankDetails;

export interface PayPalDetails {
  email: string;
  verified: boolean;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: WithdrawalMethod;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  bank_details?: BankDetails;
  paypal_details?: PayPalDetails;
  currency: string;
}
