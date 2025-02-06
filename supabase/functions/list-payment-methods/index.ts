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

    // First ensure the customer exists
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('id', user.id)
      .single()

    if (customerError || !customerData?.customer_id) {
      // Try to create the customer first
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabaseUUID: user.id,
          },
        })

        await supabase
          .from('stripe_customers')
          .insert([{ id: user.id, customer_id: customer.id }])

        // Return empty payment methods for new customer
        return new Response(
          JSON.stringify({ paymentMethods: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error creating customer:', error)
        throw new Error('Failed to create Stripe customer')
      }
    }

    // Now we can safely list payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerData.customer_id,
      type: 'card',
    })

    return new Response(
      JSON.stringify({ paymentMethods: paymentMethods.data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in list-payment-methods:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})