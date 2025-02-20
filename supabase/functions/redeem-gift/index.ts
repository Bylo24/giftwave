
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { giftId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch gift details
    const { data: gift, error: giftError } = await supabaseClient
      .from('gifts')
      .select('*')
      .eq('id', giftId)
      .single();

    if (giftError || !gift) {
      throw new Error('Gift not found');
    }

    if (gift.payment_status !== 'paid') {
      throw new Error('Gift payment is not completed');
    }

    if (gift.redemption_date) {
      throw new Error('Gift has already been redeemed');
    }

    // Update gift as redeemed
    const { error: updateError } = await supabaseClient
      .from('gifts')
      .update({
        redemption_date: new Date().toISOString(),
        status: 'redeemed'
      })
      .eq('id', giftId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, gift }),
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
