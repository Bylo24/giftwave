import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, method, cardDetails, paypalDetails, instant = false } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth user
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] ?? '');

    if (getUserError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's profile and connect account
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (!profile || profile.wallet_balance < amount) {
      throw new Error('Insufficient balance');
    }

    if (method === 'card') {
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      });

      // Get user's Connect account
      const { data: connectAccount } = await supabaseClient
        .from('stripe_connect_accounts')
        .select('account_id, instant_payouts_enabled')
        .eq('user_id', user.id)
        .single();

      if (!connectAccount) {
        throw new Error('No Stripe Connect account found');
      }

      // Create a Transfer to the connected account
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        destination: connectAccount.account_id,
      });

      // If instant payout is requested and enabled
      let payout = null;
      if (instant && connectAccount.instant_payouts_enabled) {
        payout = await stripe.payouts.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          method: 'instant',
        }, {
          stripeAccount: connectAccount.account_id,
        });
      }

      // Create withdrawal record
      const { data: withdrawal, error: withdrawalError } = await supabaseClient
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount,
          method: 'card',
          status: 'pending',
          stripe_transfer_id: transfer.id,
          instant_payout: instant,
          estimated_arrival: instant ? 
            new Date(Date.now() + 30 * 60 * 1000).toISOString() : // 30 minutes for instant
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days for standard
        })
        .select()
        .single();

      if (withdrawalError) throw withdrawalError;

      // Update user's wallet balance
      const { error: updateError } = await supabaseClient.rpc('update_wallet_balance', {
        user_id: user.id,
        amount: -amount,
      });

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          message: `Withdrawal processed successfully. ${instant ? 'Funds will be available within 30 minutes.' : 'Funds will be available in 2-3 business days.'}`,
          withdrawal,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Handle PayPal withdrawals (existing code)
    if (method === 'paypal' && !paypalDetails?.email) {
      throw new Error('PayPal email is required for PayPal withdrawals');
    }

    if (method === 'card' && !cardDetails?.paymentMethodId) {
      throw new Error('Card details are required for card withdrawals');
    }

    // Create withdrawal record
    const { error: withdrawalError } = await supabaseClient
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount,
        method,
        paypal_details: method === 'paypal' ? paypalDetails : null,
        card_details: method === 'card' ? cardDetails : null,
        status: 'pending'
      })
      .select()
      .single();

    if (withdrawalError) {
      throw withdrawalError;
    }

    // Update wallet balance
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        wallet_balance: profile.wallet_balance - amount
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Log withdrawal details
    console.log('Processing withdrawal:', {
      method,
      amount,
      details: method === 'paypal' ? paypalDetails : cardDetails
    });

    const processingTime = method === 'paypal' ? '24 hours' : '1-3 business days';
    const message = method === 'card'
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
});
