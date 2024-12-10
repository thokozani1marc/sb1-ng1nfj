import { LemonSqueezy } from '@lemonsqueezy/lemonsqueezy.js';
import { CheckoutOptions } from './types';
import { getSubscriptionStatus } from './subscription';

// Ensure store ID is properly formatted
const STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID;
const API_KEY = import.meta.env.VITE_LEMONSQUEEZY_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_LEMONSQUEEZY_API_KEY is not defined');
}

if (!STORE_ID) {
  throw new Error('VITE_LEMONSQUEEZY_STORE_ID is not defined');
}

export const lemonSqueezy = new LemonSqueezy(API_KEY);

export async function createCheckoutSession(options: CheckoutOptions): Promise<string> {
  const { planId, email, successUrl, cancelUrl, customData } = options;

  try {
    console.log('Creating checkout session:', {
      storeId: STORE_ID,
      variantId: planId,
      customData,
      email
    });

    const response = await lemonSqueezy.createCheckout({
      storeId: parseInt(STORE_ID),
      variantId: parseInt(planId),
      customData,
      checkoutOptions: {
        email,
        successUrl: successUrl || `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: cancelUrl || `${window.location.origin}/dashboard`,
      },
    });

    if (!response.data?.attributes?.url) {
      throw new Error('Checkout URL not found in response');
    }

    console.log('Checkout session created:', response.data.attributes.url);
    return response.data.attributes.url;
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error);
    throw new Error('Failed to create checkout session');
  }
}


export async function getCustomerPortalLink(userId: string): Promise<string | null> {
  try {
    // First get the subscription to get the customer ID
    const subscription = await getSubscriptionStatus(userId);
    if (!subscription?.customerId) {
      console.log('No active subscription found for user:', userId);
      return null;
    }

    const response = await lemonSqueezy.getCustomerPortal({
      customerId: subscription.customerId,
      returnUrl: `${window.location.origin}/dashboard`,
    });

    if (!response.data?.attributes?.url) {
      console.log('No portal URL found in response:', response);
      return null;
    }

    return response.data.attributes.url;
  } catch (error) {
    console.error('Error getting customer portal link:', error);
    return null;
  }
}