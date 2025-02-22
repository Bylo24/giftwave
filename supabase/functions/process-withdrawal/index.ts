
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawalRequest {
  amount: number;
  method: 'bank' | 'paypal' | 'card';
  bankDetails?: any;
  paypalDetails?: { email: string };
  cardDetails?: { paymentMethodId: string };
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

    const { amount, method, bankDetails, paypalDetails, cardDetails }: WithdrawalRequest = await req.json()

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

    if (method === 'card' && !cardDetails?.paymentMethodId) {
      throw new Error('Card details are required for card withdrawals')
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
        card_details: method === 'card' ? cardDetails : null,
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

    // Log withdrawal details
    console.log('Processing withdrawal:', {
      method,
      amount,
      details: method === 'bank' ? bankDetails : 
               method === 'paypal' ? paypalDetails : cardDetails
    });

    const processingTime = method === 'paypal' ? '24 hours' : 
                          method === 'card' ? '1-3 business days' :
                          '2-5 business days';

    const message = method === 'bank' 
      ? `Withdrawal initiated. Funds will be transferred to your ${bankDetails.country} bank account within ${processingTime}.`
      : method === 'card'
      ? `Withdrawal initiated. Funds will be sent to your card within ${processingTime}.`
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
