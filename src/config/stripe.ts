
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from "@/integrations/supabase/client";

// Get the publishable key from Supabase environment
const publishableKey = 'pk_test_51PLdMqKonEVXP26LWRu94HNC4Q7r1sw4EbWQmJkPphPfkizP5QLQQWdZ6HT123RYODmHhsmfET56ffd5NsDYWxeW00dxp0CyvZ';

if (!publishableKey) {
  console.error('Stripe publishable key is not set');
  throw new Error('Stripe publishable key is not set');
}

console.log('Initializing Stripe with publishable key:', publishableKey);

export const stripePromise = loadStripe(publishableKey);
