
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from "@/integrations/supabase/client";

let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    try {
      const { data: { publicKey }, error } = await supabase.functions.invoke('get-stripe-public-key');
      
      if (error || !publicKey) {
        console.error('Failed to get Stripe publishable key:', error);
        throw new Error('Failed to get Stripe publishable key');
      }

      console.log('Initializing Stripe with publishable key');
      stripePromise = loadStripe(publicKey);
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }
  return stripePromise;
};
