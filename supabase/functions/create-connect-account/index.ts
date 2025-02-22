
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

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // Save account details to our database
    const { error: saveError } = await supabaseClient
      .from('stripe_connect_accounts')
      .insert({
        user_id: user.id,
        account_id: account.id,
        account_type: 'express',
      });

    if (saveError) {
      throw saveError;
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get('origin')}/wallet`,
      return_url: `${req.headers.get('origin')}/wallet`,
      type: 'account_onboarding',
    });

    return new Response(
      JSON.stringify({
        url: accountLink.url,
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
