import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { stripe, corsHeaders } from '../_shared/stripe.ts'

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

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('id', user.id)
      .single()

    if (existingCustomer?.customer_id) {
      console.log('Customer already exists:', existingCustomer.customer_id)
      return new Response(
        JSON.stringify({ customerId: existingCustomer.customer_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create new Stripe customer
    console.log('Creating new Stripe customer for user:', user.id)
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabaseUUID: user.id,
      },
    })

    // Use upsert operation instead of insert
    const { error: insertError } = await supabase
      .from('stripe_customers')
      .upsert(
        { id: user.id, customer_id: customer.id },
        { onConflict: 'id' }
      )

    if (insertError) {
      console.error('Error upserting customer:', insertError)
      throw insertError
    }

    console.log('Successfully created Stripe customer:', customer.id)
    return new Response(
      JSON.stringify({ customerId: customer.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ensure-stripe-customer:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})