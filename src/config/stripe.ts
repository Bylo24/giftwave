import { loadStripe } from '@stripe/stripe-js';

const publishableKey = 'pk_live_51PLdMqKonEVXP26LVRu94HNC4Q7r1sw4EbWQmJkPphPfkizP5QLQQWdZ6HT123RYODmHhsmfET56ffd5NsDYWxeW00dxp0CyvZ';

if (!publishableKey) {
  throw new Error('Stripe publishable key is not set');
}

export const stripePromise = loadStripe(publishableKey);