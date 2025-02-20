
import { createClient } from '@supabase/supabase-js';
import { stripe } from '../_shared/stripe';
import { corsHeaders } from '../_shared/cors';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { giftId, amount, token } = await req.json();
    console.log('Processing checkout for gift:', { giftId, amount, token });

    if (!giftId || !amount || !token) {
      throw new Error('Missing required parameters');
    }

    // Get gift details from database
    const { data: giftData, error: giftError } = await supabase
      .from('gift_designs')
      .select('*')
      .eq('id', giftId)
      .single();

    if (giftError || !giftData) {
      console.error('Error fetching gift:', giftError);
      throw new Error('Gift not found');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gift Payment',
              description: 'Gift payment through GiftWave'
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancel_url: `${req.headers.get('origin')}/preview?token=${token}`,
    });

    console.log('Created checkout session:', session.id);

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
