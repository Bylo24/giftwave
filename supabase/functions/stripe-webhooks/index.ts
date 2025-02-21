
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.3";
import { corsHeaders } from "../_shared/cors.ts";

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing Stripe signature or webhook secret');
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const giftDesignId = session.metadata.gift_design_id;
        
        // Record the payment event
        await supabaseClient.from('payment_events').insert({
          gift_design_id: giftDesignId,
          stripe_event_id: event.id,
          event_type: event.type,
          status: 'succeeded',
          amount: session.amount_total,
          fee_amount: session.total_details?.amount_tax,
          metadata: session
        });

        // Update gift design status
        await supabaseClient
          .from('gift_designs')
          .update({
            status: 'finalized',
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            last_webhook_event_id: event.id
          })
          .eq('id', giftDesignId);

        break;
      }

      case 'charge.failed': {
        const charge = event.data.object;
        const session = await stripe.checkout.sessions.retrieve(charge.metadata.session_id);
        const giftDesignId = session.metadata.gift_design_id;

        await supabaseClient.from('payment_events').insert({
          gift_design_id: giftDesignId,
          stripe_event_id: event.id,
          event_type: event.type,
          status: 'failed',
          amount: charge.amount,
          metadata: charge
        });

        await supabaseClient
          .from('gift_designs')
          .update({
            payment_status: 'failed',
            payment_failure_reason: charge.failure_message,
            last_webhook_event_id: event.id
          })
          .eq('id', giftDesignId);

        break;
      }

      case 'charge.refunded': {
        const refund = event.data.object;
        const session = await stripe.checkout.sessions.retrieve(refund.metadata.session_id);
        const giftDesignId = session.metadata.gift_design_id;

        await supabaseClient.from('payment_events').insert({
          gift_design_id: giftDesignId,
          stripe_event_id: event.id,
          event_type: event.type,
          status: 'refunded',
          amount: refund.amount_refunded,
          metadata: refund
        });

        await supabaseClient
          .from('gift_designs')
          .update({
            payment_status: 'refunded',
            refund_status: 'completed',
            last_webhook_event_id: event.id
          })
          .eq('id', giftDesignId);

        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object;
        const session = await stripe.checkout.sessions.retrieve(dispute.metadata.session_id);
        const giftDesignId = session.metadata.gift_design_id;

        await supabaseClient.from('payment_events').insert({
          gift_design_id: giftDesignId,
          stripe_event_id: event.id,
          event_type: event.type,
          status: 'disputed',
          amount: dispute.amount,
          metadata: dispute
        });

        await supabaseClient
          .from('gift_designs')
          .update({
            payment_status: 'disputed',
            dispute_status: dispute.status,
            last_webhook_event_id: event.id
          })
          .eq('id', giftDesignId);

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const giftDesignId = session.metadata.gift_design_id;

        await supabaseClient.from('payment_events').insert({
          gift_design_id: giftDesignId,
          stripe_event_id: event.id,
          event_type: event.type,
          status: 'expired',
          amount: session.amount_total,
          metadata: session
        });

        await supabaseClient
          .from('gift_designs')
          .update({
            payment_status: 'expired',
            last_webhook_event_id: event.id
          })
          .eq('id', giftDesignId);

        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
