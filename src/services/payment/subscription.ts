import { supabase } from '../../lib/supabase';
import { SubscriptionStatus } from './types';
import { AuthError } from '../../utils/error.utils';

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return {
      id: data.subscription_id,
      customerId: data.customer_id,
      status: data.status,
      currentPeriodEnd: data.current_period_end,
      cancelAt: data.cancel_at,
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new AuthError('Failed to fetch subscription status', error);
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new AuthError('Failed to cancel subscription', error);
  }
}