import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No auth header')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) throw userError || new Error('No user found')

    // Get or create Stripe customer
    const { data: customerData } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('id', user.id)
      .single()

    if (!customerData?.customer_id) {
      throw new Error('No Stripe customer found')
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerData.customer_id,
      type: 'card',
    })

    return new Response(
      JSON.stringify({ paymentMethods: paymentMethods.data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})