
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

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

    // Get user's profile and connect account ID
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_connect_account_id, wallet_balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw profileError || new Error('Profile not found')
    }

    if (!profile.stripe_connect_account_id) {
      throw new Error('No Stripe Connect account found')
    }

    if (profile.wallet_balance < amount) {
      throw new Error('Insufficient balance')
    }

    // Create a transfer to the connected account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      destination: profile.stripe_connect_account_id,
    })

    // Create withdrawal record
    const { error: withdrawalError } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        status: 'completed',
        stripe_payout_id: transfer.id
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
      JSON.stringify({ success: true, transfer }),
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
