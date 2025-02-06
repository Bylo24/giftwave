import { loadStripe } from '@stripe/stripe-js';

// Use the publishable key directly since it's safe for frontend
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');