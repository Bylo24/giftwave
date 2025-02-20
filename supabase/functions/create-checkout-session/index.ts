
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.3.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { giftId, amount, token } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch gift details
    const { data: gift, error: giftError } = await supabaseClient
      .from('gift_designs')
      .select('*')
      .eq('id', giftId)
      .single();

    if (giftError || !gift) {
      throw new Error('Gift not found');
    }

    // Calculate total amount (gift amount + platform fee)
    const platformFee = parseFloat((amount * 0.05).toFixed(2)); // 5% platform fee
    const totalAmount = amount + platformFee;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gift Payment',
              description: `Gift payment including ${platformFee.toFixed(2)} USD platform fee`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancel_url: `${req.headers.get('origin')}/previewanimation?token=${token}`,
      metadata: {
        giftId: gift.id,
        token: token,
      },
    });

    // Update gift with Stripe session ID
    await supabaseClient
      .from('gift_designs')
      .update({
        stripe_session_id: session.id,
        platform_fee: platformFee,
        payment_status: 'pending'
      })
      .eq('id', giftId);

    return new Response(
      JSON.stringify({ sessionId: session.id, sessionUrl: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
