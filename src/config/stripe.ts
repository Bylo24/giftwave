import { loadStripe } from "@stripe/stripe-js";

// Make sure the publishable key is valid
export const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51PLdMqKonEVXP26LVRu94HNC4Q7r1sw4EbWQmJkPphPfkizP5QLQQWdZ6HT123RYODmHhsmfET56ffd5NsDYWxeW00dxp0CyvZ');