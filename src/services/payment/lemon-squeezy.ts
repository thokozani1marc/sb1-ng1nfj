import { LemonSqueezy } from '@lemonsqueezy/lemonsqueezy.js';
import { CheckoutOptions } from './types';

// Ensure store ID is properly formatted
const STORE_ID = '129862';
const API_KEY = import.meta.env.VITE_LEMONSQUEEZY_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_LEMONSQUEEZY_API_KEY is not defined');
}

export const lemonSqueezy = new LemonSqueezy({
  apiKey: API_KEY,
});

export async function createCheckoutSession(options: CheckoutOptions): Promise<string> {
  const { userId, planId, email, successUrl, cancelUrl } = options;

  try {
    const response = await lemonSqueezy.createCheckout({
      storeId: parseInt(STORE_ID), // Changed from store to storeId
      variantId: parseInt(planId),
      customData: {
        user_id: userId,
        plan_id: planId,
      },
      checkoutOptions: {
        email,
        successUrl: successUrl || `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: cancelUrl || `${window.location.origin}/dashboard`,
      },
    });

    if (!response.data?.attributes?.url) {
      throw new Error('Checkout URL not found in response');
    }

    return response.data.attributes.url;
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error);
    throw new Error('Failed to create checkout session');
  }
}