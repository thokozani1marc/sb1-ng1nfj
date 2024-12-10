import { supabaseAdmin } from '../../lib/supabase-admin';
import { SubscriptionStatus } from './types';
import { AuthError } from '../../utils/error.utils';

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
  try {
    console.log('Fetching subscription status for user:', userId);
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('subscription_id, customer_id, status, current_period_end, cancel_at, card_brand, card_last_four, update_payment_method_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }

    if (!data) {
      console.log('No subscription found for user:', userId);
      return null;
    }

    console.log('Found subscription:', data);
    return {
      id: data.subscription_id,
      customerId: data.customer_id,
      status: data.status,
      currentPeriodEnd: data.current_period_end,
      cancelAt: data.cancel_at,
      cardBrand: data.card_brand,
      cardLastFour: data.card_last_four,
      updatePaymentMethodUrl: data.update_payment_method_url
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new AuthError('Failed to fetch subscription status', error);
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  try {
    console.log('Cancelling subscription:', subscriptionId);
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId);

    if (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }

    console.log('Successfully cancelled subscription:', subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new AuthError('Failed to cancel subscription', error);
  }
}