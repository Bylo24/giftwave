import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with the publishable key
export const stripePromise = loadStripe('pk_live_51PLdMqKonEVXP26LVRu94HNC4Q7r1sw4EbWQmJkPphPfkizP5QLQQWdZ6HT123RYODmHhsmfET56ffd5NsDYWxeW00dxp0CyvZ');