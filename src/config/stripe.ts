import { loadStripe } from "@stripe/stripe-js";

// Make sure the publishable key is valid
export const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51OpGxfEuQGHRyZU8qTxHWZvtKHJa4z7wCOYyxVxwXtPvvzqjIWF9qxDEsAGBxgEyEPEHbPxhPSzlBXTLYyRVzXAw00J5YFZK3N');