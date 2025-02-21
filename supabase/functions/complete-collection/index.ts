
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { giftToken, verificationCode } = await req.json();

    // Verify the code
    const { data: verification, error: verificationError } = await supabaseClient
      .from('recipient_verifications')
      .select('*, gifts(*)')
      .eq('verification_code', verificationCode)
      .eq('gifts.token', giftToken)
      .single();

    if (verificationError || !verification) {
      throw new Error('Invalid verification code');
    }

    if (new Date(verification.expires_at) < new Date()) {
      throw new Error('Verification code expired');
    }

    // Mark verification as complete
    await supabaseClient
      .from('recipient_verifications')
      .update({ 
        verified_at: new Date().toISOString(),
      })
      .eq('id', verification.id);

    // Update gift collection status
    await supabaseClient
      .from('gifts')
      .update({ 
        collection_status: 'completed',
        collected_at: new Date().toISOString(),
      })
      .eq('id', verification.gift_id);

    // Create Stripe transfer to recipient
    // In production, you would implement proper Stripe Connect onboarding
    const transfer = await stripe.transfers.create({
      amount: verification.gifts.amount * 100, // Convert to cents
      currency: 'usd',
      destination: 'your_connected_stripe_account', // This would be the recipient's connected account
      transfer_group: `gift_${verification.gift_id}`,
    });

    return new Response(
      JSON.stringify({ 
        message: 'Gift collected successfully',
        transfer: transfer.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
