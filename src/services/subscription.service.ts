import { supabaseAdmin } from '../lib/supabase-admin';
import { AuthError } from '../utils/error.utils';

export interface Subscription {
  id: string;
  user_id: string;
  subscription_id: string;
  customer_id: string;
  plan_id: string;
  variant_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'expired';
  current_period_start: string;
  current_period_end: string;
  cancel_at?: string;
  card_brand?: string;
  card_last_four?: string;
  trial_ends_at?: string;
  billing_anchor?: number;
  update_payment_method_url?: string;
  created_at: string;
  updated_at: string;
}

export class SubscriptionService {
  static async createSubscription(data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
    try {
      console.log('Creating subscription with data:', JSON.stringify(data, null, 2));

      // Test database connection
      const { data: testData, error: testError } = await supabaseAdmin
        .from('subscriptions')
        .select('count(*)')
        .limit(1);

      if (testError) {
        console.error('Database connection test failed:', {
          error: testError,
          code: testError.code,
          message: testError.message,
          details: testError.details
        });
        throw new AuthError('Failed to connect to database', testError);
      }

      console.log('Database connection test successful:', testData);

      // Check if subscription already exists
      const { data: existingSub, error: fetchError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('subscription_id', data.subscription_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing subscription:', {
          error: fetchError,
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          query: { subscription_id: data.subscription_id }
        });
        throw new AuthError('Failed to check existing subscription', fetchError);
      }

      if (existingSub) {
        console.log('Subscription exists, updating:', {
          id: existingSub.id,
          subscription_id: existingSub.subscription_id,
          status: existingSub.status
        });
        // Update existing subscription
        return this.updateSubscription(data.subscription_id, {
          ...data,
          updated_at: new Date().toISOString(),
        });
      }

      console.log('Creating new subscription with data:', {
        user_id: data.user_id,
        subscription_id: data.subscription_id,
        customer_id: data.customer_id,
        plan_id: data.plan_id,
        variant_id: data.variant_id,
        status: data.status,
        current_period_start: data.current_period_start,
        current_period_end: data.current_period_end
      });

      // Create new subscription
      const { data: newSub, error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert([{
          user_id: data.user_id,
          subscription_id: data.subscription_id,
          customer_id: data.customer_id,
          plan_id: data.plan_id,
          variant_id: data.variant_id,
          status: data.status,
          current_period_start: data.current_period_start,
          current_period_end: data.current_period_end,
          card_brand: data.card_brand,
          card_last_four: data.card_last_four,
          trial_ends_at: data.trial_ends_at,
          billing_anchor: data.billing_anchor,
          update_payment_method_url: data.update_payment_method_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating subscription:', {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          data: JSON.stringify(data, null, 2)
        });
        throw new AuthError('Failed to create subscription', insertError);
      }

      console.log('Successfully created subscription:', {
        id: newSub.id,
        subscription_id: newSub.subscription_id,
        status: newSub.status,
        user_id: newSub.user_id
      });
      return true;
    } catch (error) {
      console.error('Error in createSubscription:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        data: JSON.stringify(data, null, 2)
      });
      throw new AuthError('Failed to create subscription', error);
    }
  }

  static async updateSubscription(subscriptionId: string, data: Partial<Subscription>) {
    try {
      console.log('Updating subscription:', subscriptionId, data);

      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscriptionId);

      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }

      console.log('Successfully updated subscription:', subscriptionId);
      return true;
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      throw new AuthError('Failed to update subscription', error);
    }
  }

  static async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      console.log('Fetching subscription for user:', userId);

      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        throw error;
      }

      console.log('Found subscription:', data);
      return data;
    } catch (error) {
      console.error('Error in getSubscription:', error);
      throw new AuthError('Failed to fetch subscription', error);
    }
  }

  static async cancelSubscription(subscriptionId: string) {
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
      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      throw new AuthError('Failed to cancel subscription', error);
    }
  }
}