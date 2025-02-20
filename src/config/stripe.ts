
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = 'pk_live_51PLdMqKonEVXP26LQFXVIgZFCK2Z7AW6NQLZ3W1xm0NcbSQjxXhLKPn53sIWm7Nlo9YoVYlX99rNEZM7pHNRQXRO00GwKiB1f0';

if (!publishableKey) {
  throw new Error('Stripe publishable key is not set');
}

export const stripePromise = loadStripe(publishableKey);
