
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.12.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

function calculatePlatformFee(amount: number): number {
  if (amount <= 20) {
    // $1-$20: Max of ($3.00 or 15%)
    return Math.max(3, amount * 0.15);
  } else if (amount <= 100) {
    // $21-$100: 8% + $2.00
    return (amount * 0.08) + 2;
  } else if (amount <= 500) {
    // $101-$500: 6% + $4.00
    return (amount * 0.06) + 4;
  } else if (amount <= 2000) {
    // $501-$2,000: 5% + $10.00
    return (amount * 0.05) + 10;
  } else if (amount <= 5000) {
    // $2,001-$5,000: 4% + $20.00
    return (amount * 0.04) + 20;
  } else {
    // $5,001+: 3.5% + $30.00
    return (amount * 0.035) + 30;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { giftId, amount, token, returnUrl } = await req.json();
    console.log('Processing checkout for gift:', { giftId, amount, token });

    if (!giftId || !amount || amount <= 0 || !token) {
      throw new Error('Invalid parameters: Amount must be greater than 0');
    }

    // Verify gift exists and amount matches
    const { data: giftData, error: giftError } = await supabase
      .from('gift_designs')
      .select('*')
      .eq('id', giftId)
      .eq('token', token)
      .single();

    if (giftError || !giftData) {
      console.error('Error fetching gift:', giftError);
      throw new Error('Gift not found');
    }

    if (giftData.selected_amount !== amount) {
      console.error('Amount mismatch:', { stored: giftData.selected_amount, requested: amount });
      throw new Error('Amount mismatch');
    }

    // Calculate platform fee
    const platformFee = calculatePlatformFee(amount);
    console.log('Calculated platform fee:', platformFee);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Gift Amount',
              description: 'Gift payment through GiftWave'
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Platform Fee',
              description: 'GiftWave service fee'
            },
            unit_amount: Math.round(platformFee * 100), // Convert to cents
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancel_url: `${req.headers.get('origin')}/previewanimation?token=${token}`,
    });

    console.log('Created checkout session:', session.id);

    // Update gift design with session ID and platform fee
    const { error: updateError } = await supabase
      .from('gift_designs')
      .update({ 
        stripe_session_id: session.id,
        platform_fee: platformFee,
        status: 'preview'
      })
      .eq('id', giftId);

    if (updateError) {
      console.error('Error updating gift design:', updateError);
      // Continue anyway as this is not critical
    }

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
