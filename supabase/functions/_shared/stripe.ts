import Stripe from "https://esm.sh/stripe@14.12.0?target=deno";

// Use the restricted key from Supabase secrets
const stripeKey = Deno.env.get('STRIPE_RESTRICTED_KEY');
if (!stripeKey) {
  throw new Error('Missing Stripe restricted key');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

export const updateWalletBalance = async (
  supabase: any,
  userId: string,
  amount: number
) => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  if (profileError) {
    throw profileError;
  }

  const newBalance = (profile.wallet_balance || 0) + amount;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  if (updateError) {
    throw updateError;
  }

  return newBalance;
};
