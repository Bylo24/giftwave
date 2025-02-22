
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BaseBankDetails {
  accountHolderName: string;
  bankName: string;
  accountType: string;
  country: string;
  currency: string;
}

interface USBankDetails extends BaseBankDetails {
  country: 'US';
  routingNumber: string;
  accountNumber: string;
}

interface EUBankDetails extends BaseBankDetails {
  country: string;
  iban: string;
  swiftCode: string;
}

interface UKBankDetails extends BaseBankDetails {
  country: 'GB';
  sortCode: string;
  accountNumber: string;
}

interface AUBankDetails extends BaseBankDetails {
  country: 'AU';
  bsb: string;
  accountNumber: string;
}

type BankDetails = USBankDetails | EUBankDetails | UKBankDetails | AUBankDetails;

interface PayPalDetails {
  email: string;
}

interface WithdrawalRequest {
  amount: number;
  method: 'bank' | 'paypal';
  bankDetails?: BankDetails;
  paypalDetails?: PayPalDetails;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw userError || new Error('User not found')
    }

    const { amount, method, bankDetails, paypalDetails }: WithdrawalRequest = await req.json()

    // Get user's profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw profileError || new Error('Profile not found')
    }

    if (profile.wallet_balance < amount) {
      throw new Error('Insufficient balance')
    }

    // Validate withdrawal details based on method
    if (method === 'bank' && !bankDetails) {
      throw new Error('Bank details are required for bank transfers')
    }

    if (method === 'paypal' && !paypalDetails?.email) {
      throw new Error('PayPal email is required for PayPal withdrawals')
    }

    // Create withdrawal record
    const { error: withdrawalError } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        method,
        bank_details: method === 'bank' ? bankDetails : null,
        paypal_details: method === 'paypal' ? paypalDetails : null,
        status: 'pending'
      })
      .select()
      .single()

    if (withdrawalError) {
      throw withdrawalError
    }

    // Update wallet balance
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        wallet_balance: profile.wallet_balance - amount
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    // Log withdrawal details for processing
    console.log('Processing withdrawal:', {
      method,
      amount,
      details: method === 'bank' ? bankDetails : paypalDetails
    });

    const processingTime = method === 'paypal' ? '24 hours' : '2-5 business days';
    const message = method === 'bank' 
      ? `Withdrawal initiated. Funds will be transferred to your ${bankDetails?.country} bank account within ${processingTime}.`
      : `Withdrawal initiated. Funds will be sent to your PayPal account (${paypalDetails?.email}) within ${processingTime}.`;

    return new Response(
      JSON.stringify({ 
        success: true,
        message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
