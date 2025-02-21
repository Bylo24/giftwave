
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.12.0?target=deno";

const PLATFORM_FEE_PERCENTAGE = 0.08; // 8%
const PLATFORM_FEE_FIXED = 2.00; // $2

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { giftId, token, amount } = await req.json();

    console.log('Creating payment intent for gift:', { giftId, token, amount });

    if (!giftId || !token || !amount) {
      throw new Error('Missing required parameters');
    }

    const platformFee = (amount * PLATFORM_FEE_PERCENTAGE) + PLATFORM_FEE_FIXED;
    const totalAmount = amount + platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        giftId,
        token,
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
