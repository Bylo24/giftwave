
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { amount } = await req.json()

    // Get user's profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('wallet_balance, email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw profileError || new Error('Profile not found')
    }

    if (profile.wallet_balance < amount) {
      throw new Error('Insufficient balance')
    }

    // PayPal API Authentication
    const paypalAuth = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_SECRET_KEY')}`)}`,
      },
      body: 'grant_type=client_credentials'
    });

    const { access_token } = await paypalAuth.json();

    // Create PayPal Payout
    const payoutResponse = await fetch('https://api-m.sandbox.paypal.com/v1/payments/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        sender_batch_header: {
          sender_batch_id: `GiftWave_${Date.now()}`,
          email_subject: "You have money from GiftWave!",
          email_message: "You received a payout from your GiftWave wallet"
        },
        items: [{
          recipient_type: "EMAIL",
          amount: {
            value: amount,
            currency: "USD"
          },
          receiver: profile.email,
          note: "GiftWave wallet withdrawal",
          sender_item_id: `PAYOUT_${Date.now()}`
        }]
      })
    });

    const payoutResult = await payoutResponse.json();

    if (!payoutResponse.ok) {
      console.error('PayPal payout error:', payoutResult);
      throw new Error(payoutResult.message || 'Failed to process PayPal payout');
    }

    // Create withdrawal record
    const { error: withdrawalError } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        status: 'completed',
        stripe_payout_id: payoutResult.batch_header.payout_batch_id
      })

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        payout: payoutResult
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
