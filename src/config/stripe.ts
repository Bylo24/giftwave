import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

// Initialize Stripe with the publishable key from Supabase secrets
export const stripePromise = loadStripe(Deno.env.get('STRIPE_PUBLISHABLE_KEY') || '');