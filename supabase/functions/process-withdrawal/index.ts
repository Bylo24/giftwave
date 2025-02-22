
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
}

interface WithdrawalRequest {
  amount: number;
  method: 'bank' | 'paypal';
  bankDetails?: BankDetails;
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

    const { amount, method, bankDetails }: WithdrawalRequest = await req.json()

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

    // Create withdrawal record
    const { error: withdrawalError } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        method,
        bank_details: method === 'bank' ? bankDetails : null,
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

    // In a real production environment, you would integrate with your bank's API
    // For this demo, we'll simulate a successful withdrawal
    console.log('Processing withdrawal:', {
      method,
      amount,
      bankDetails: method === 'bank' ? bankDetails : 'Using PayPal'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: method === 'bank' 
          ? 'Withdrawal initiated. Funds will be transferred to your bank account within 2-3 business days.'
          : 'Withdrawal initiated. Funds will be sent to your PayPal account.'
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
