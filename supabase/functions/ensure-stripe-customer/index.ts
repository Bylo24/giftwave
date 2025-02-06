import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { stripe, corsHeaders } from '../_shared/stripe.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create regular client for user authentication
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

    console.log('Checking existing customer for user:', user.id)
    
    // Use admin client for database operations
    const { data: existingCustomer } = await supabaseAdmin
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

    // Use admin client for insert operation
    const { error: insertError } = await supabaseAdmin
      .from('stripe_customers')
      .insert([
        { id: user.id, customer_id: customer.id }
      ])

    if (insertError) {
      console.error('Error inserting customer:', insertError)
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