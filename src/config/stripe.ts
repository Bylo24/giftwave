import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Stripe publishable key is not set. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
}

export const stripePromise = loadStripe(publishableKey);