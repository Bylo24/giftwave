import { loadStripe } from '@stripe/stripe-js';

const publishableKey = 'pk_test_51PLdMqKonEVXP26LiUmxei5KWe25M9hiA85KuoyBcnrFEVYAOFcim8AkJ3gOxLICzfWfctIjBazbW5oBXwkJLdzp00Ekin6r80';

if (!publishableKey) {
  throw new Error('Stripe publishable key is not set');
}

export const stripePromise = loadStripe(publishableKey);