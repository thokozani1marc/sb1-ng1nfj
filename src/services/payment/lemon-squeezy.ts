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

const handleSubscribe = async () => {
  try {
    const options: CheckoutOptions = {
      userId: 'your_user_id', // Replace with actual user ID
      planId: 'your_plan_id', // Replace with actual plan ID
      email: 'user@example.com', // Replace with actual user email
      successUrl: '/dashboard', // Redirect to dashboard
      cancelUrl: '/cancel',
    };

    const sessionUrl = await createCheckoutSession(options);
    if (sessionUrl) {
      window.location.href = sessionUrl;
    }
  } catch (error) {
    console.error('Subscription error:', error);
    alert('There was an error processing your subscription. Please try again later.');
  }
};

export async function getCustomerPortalLink(userId: string): Promise<string> {
  try {
    // First get the subscription to get the customer ID
    const subscription = await getSubscriptionStatus(userId);
    if (!subscription?.customerId) {
      throw new Error('No active subscription found');
    }

    const response = await lemonSqueezy.getCustomerPortal({
      customerId: subscription.customerId,
      returnUrl: `${window.location.origin}/dashboard`,
    });

    if (!response.data?.attributes?.url) {
      throw new Error('Customer portal URL not found in response');
    }

    return response.data.attributes.url;
  } catch (error) {
    console.error('Error fetching customer portal link:', error);
    throw error;
  }
}