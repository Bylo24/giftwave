
import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from Supabase environment
const publishableKey = 'pk_test_51PLdMqKonEVXP26LWRu94HNC4Q7r1sw4EbWQmJkPphPfkizP5QLQQWdZ6HT123RYODmHhsmfET56ffd5NsDYWxeW00dxp0CyvZ';

if (!publishableKey) {
  throw new Error('Stripe publishable key is not set');
}

export const stripePromise = loadStripe(publishableKey);
