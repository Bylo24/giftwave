
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from '@supabase/supabase-js';

console.log("Loading create-checkout-session function...");

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { giftId, amount, token } = await req.json();
    console.log("Creating checkout session for gift:", { giftId, amount, token });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gift',
              description: 'Digital gift card',
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancel_url: `${req.headers.get('origin')}/previewanimation?token=${token}`,
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ sessionUrl: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
