
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Stripe secret key
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('Stripe secret key not found');
      throw new Error('Stripe configuration error');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Parse and validate request body
    const { giftId, amount, token } = await req.json();
    
    if (!giftId || !amount || !token) {
      console.error('Missing required parameters:', { giftId, amount, token });
      throw new Error('Missing required parameters');
    }

    console.log('Processing checkout for gift:', { giftId, amount, token });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing');
      throw new Error('Backend configuration error');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Fetch gift details
    const { data: gift, error: giftError } = await supabaseClient
      .from('gift_designs')
      .select('*')
      .eq('id', giftId)
      .single();

    if (giftError) {
      console.error('Error fetching gift:', giftError);
      throw new Error('Gift not found');
    }

    if (!gift) {
      console.error('Gift not found:', giftId);
      throw new Error('Gift not found');
    }

    // Calculate total amount (gift amount + platform fee)
    const platformFee = Math.round(amount * 0.05 * 100) / 100; // 5% platform fee, rounded to 2 decimals
    const totalAmount = amount + platformFee;
    
    // Convert amount to cents and ensure it's a valid integer
    const amountInCents = Math.round(totalAmount * 100);

    console.log('Creating checkout session:', {
      giftId,
      originalAmount: amount,
      platformFee,
      totalAmount,
      amountInCents
    });

    try {
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
              unit_amount: amountInCents,
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

      console.log('Checkout session created:', {
        sessionId: session.id,
        sessionUrl: session.url
      });

      // Update gift with Stripe session ID
      const { error: updateError } = await supabaseClient
        .from('gift_designs')
        .update({
          stripe_session_id: session.id,
          platform_fee: platformFee,
          payment_status: 'pending'
        })
        .eq('id', giftId);

      if (updateError) {
        console.error('Error updating gift design:', updateError);
        // Continue anyway since the checkout session was created
      }

      return new Response(
        JSON.stringify({ 
          sessionId: session.id, 
          sessionUrl: session.url 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );

    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      throw new Error(`Stripe error: ${stripeError.message}`);
    }

  } catch (error) {
    console.error('Error processing checkout:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
