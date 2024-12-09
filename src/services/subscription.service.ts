import { supabase } from '../lib/supabase';
import { AuthError } from '../utils/error.utils';

export interface Subscription {
  id: string;
  user_id: string;
  subscription_id: string;
  customer_id: string;
  plan_id: string;
  variant_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at?: string;
  created_at: string;
  updated_at: string;
}

export class SubscriptionService {
  static async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No subscription found
        return null;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw new AuthError('Failed to fetch subscription', error);
    }
  }

  static async createSubscription(data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new AuthError('Failed to create subscription', error);
    }
  }

  static async updateSubscription(subscriptionId: string, data: Partial<Subscription>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscriptionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new AuthError('Failed to update subscription', error);
    }
  }

  static async cancelSubscription(subscriptionId: string) {
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
}