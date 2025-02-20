
import Stripe from "https://esm.sh/stripe@14.12.0?target=deno";

// Use the restricted key from Supabase secrets
const stripeKey = Deno.env.get('STRIPE_RESTRICTED_KEY');
if (!stripeKey) {
  throw new Error('Missing Stripe restricted key');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});
