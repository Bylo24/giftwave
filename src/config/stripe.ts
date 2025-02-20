
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from "@/integrations/supabase/client";

async function getPublishableKey() {
  const { data: { publicKey }, error } = await supabase.functions.invoke('get-stripe-public-key');
  
  if (error || !publicKey) {
    console.error('Failed to get Stripe publishable key:', error);
    throw new Error('Failed to get Stripe publishable key');
  }

  return publicKey;
}

// Initialize Stripe with the publishable key
const publishableKey = await getPublishableKey();
console.log('Initializing Stripe with publishable key');

export const stripePromise = loadStripe(publishableKey);
