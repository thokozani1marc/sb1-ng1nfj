import { supabaseAdmin } from '../lib/supabase-admin';
import { SubscriptionService } from './subscription.service';
import * as crypto from 'crypto';

interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: {
      user_id: string;
      plan_id: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      identifier: string;
      subscription_id: number;
      variant_id: number;
      product_id: number;
      status: string;
      card_brand: string | null;
      card_last_four: string | null;
      pause: null | {
        mode: string;
        resumes_at: string;
      };
      cancelled: boolean;
      trial_ends_at: null | string;
      billing_anchor: number;
      urls: {
        update_payment_method: string;
      };
      renews_at: string;
      ends_at: null | string;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
    };
  };
}

export class WebhookService {
  private static readonly WEBHOOK_SECRET = process.env.VITE_LEMONSQUEEZY_WEBHOOK_SECRET || '0786384291';
  private static readonly MAKE_WEBHOOK_URL = process.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.us1.make.com/doscwwuhvxdxfwb2iwqtfxvpvrh1y8gx';

  static async handleWebhook(
    signature: string,
    payload: LemonSqueezyWebhookEvent
  ) {
    try {
      console.log('Received webhook:', {
        event: payload.meta.event_name,
        customData: payload.meta.custom_data,
        attributes: payload.data.attributes,
        signature
      });

      // Log the incoming webhook
      const { data: logEntry, error: logError } = await supabaseAdmin
        .from('webhook_logs')
        .insert({
          event_name: payload.meta.event_name,
          payload: payload,
        })
        .select()
        .single();

      if (logError) {
        console.error('Error logging webhook:', logError);
        throw logError;
      }

      console.log('Webhook logged successfully:', logEntry);

      // Verify webhook signature
      if (!this.verifySignature(signature, payload)) {
        const error = new Error('Invalid webhook signature');
        console.error('Signature verification failed:', {
          received: signature,
          payload: JSON.stringify(payload),
          secret: this.WEBHOOK_SECRET
        });
        await this.updateWebhookLogError(logEntry?.id, error.message);
        throw error;
      }

      console.log('Signature verified successfully');

      const { event_name } = payload.meta;
      const { attributes } = payload.data;

      // Extract user_id and plan_id from custom_data or from the subscription metadata
      const userId = payload.meta.custom_data?.user_id;
      const planId = payload.meta.custom_data?.plan_id;

      if (!userId) {
        const error = new Error('Missing user_id in webhook payload');
        console.error('Missing user_id:', {
          meta: payload.meta,
          customData: payload.meta.custom_data,
          fullPayload: payload
        });
        await this.updateWebhookLogError(logEntry?.id, error.message);
        throw error;
      }

      console.log('Processing webhook for:', {
        userId,
        planId,
        event: event_name,
        subscriptionId: attributes.subscription_id
      });

      // Process the webhook based on event type
      switch (event_name) {
        case 'subscription_created':
          await this.handleSubscriptionCreated(attributes, userId, planId || attributes.variant_id.toString());
          break;
        case 'subscription_updated':
          await this.handleSubscriptionUpdated(attributes);
          break;
        case 'subscription_cancelled':
          await this.handleSubscriptionCancelled(attributes);
          break;
        case 'subscription_resumed':
          await this.handleSubscriptionResumed(attributes);
          break;
        case 'subscription_expired':
          await this.handleSubscriptionExpired(attributes);
          break;
        default:
          console.log(`Unhandled webhook event: ${event_name}`);
      }

      // Forward the webhook to Make.com
      await this.forwardToMake(payload);

      // Update webhook log with success
      if (logEntry?.id) {
        await supabaseAdmin
          .from('webhook_logs')
          .update({ processed_at: new Date().toISOString() })
          .eq('id', logEntry.id);
      }

      console.log('Successfully processed webhook:', event_name);
    } catch (error) {
      // Log the error in webhook_logs
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Webhook processing error:', {
        error,
        errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (payload?.meta?.event_name) {
        await supabaseAdmin
          .from('webhook_logs')
          .update({
            error: errorMessage,
            processed_at: new Date().toISOString()
          })
          .eq('event_name', payload.meta.event_name)
          .is('processed_at', null);
      }

      throw error;
    }
  }

  private static async handleSubscriptionCreated(
    attributes: LemonSqueezyWebhookEvent['data']['attributes'],
    userId: string,
    planId: string
  ) {
    console.log('Creating subscription:', {
      userId,
      planId,
      subscriptionId: attributes.subscription_id,
      attributes
    });

    try {
      const result = await SubscriptionService.createSubscription({
        user_id: userId,
        subscription_id: attributes.subscription_id.toString(),
        customer_id: attributes.customer_id.toString(),
        plan_id: planId,
        variant_id: attributes.variant_id.toString(),
        status: 'active',
        current_period_start: attributes.created_at,
        current_period_end: attributes.renews_at,
        card_brand: attributes.card_brand || null,
        card_last_four: attributes.card_last_four || null,
        trial_ends_at: attributes.trial_ends_at,
        billing_anchor: attributes.billing_anchor,
        update_payment_method_url: attributes.urls.update_payment_method
      });

      console.log('Subscription creation result:', result);
      return result;
    } catch (error) {
      console.error('Failed to create subscription:', {
        error,
        userId,
        planId,
        subscriptionId: attributes.subscription_id
      });
      throw error;
    }
  }

  private static async handleSubscriptionUpdated(
    attributes: LemonSqueezyWebhookEvent['data']['attributes']
  ) {
    console.log('Updating subscription:', {
      subscriptionId: attributes.subscription_id,
      attributes
    });

    await SubscriptionService.updateSubscription(
      attributes.subscription_id.toString(),
      {
        status: attributes.status,
        current_period_end: attributes.renews_at,
        cancel_at: attributes.ends_at || undefined,
        card_brand: attributes.card_brand,
        card_last_four: attributes.card_last_four,
        update_payment_method_url: attributes.urls.update_payment_method
      }
    );
  }

  private static async handleSubscriptionCancelled(
    attributes: LemonSqueezyWebhookEvent['data']['attributes']
  ) {
    console.log('Cancelling subscription:', {
      subscriptionId: attributes.subscription_id,
      attributes
    });

    await SubscriptionService.updateSubscription(
      attributes.subscription_id.toString(),
      {
        status: 'canceled',
        cancel_at: new Date().toISOString(),
      }
    );
  }

  private static async handleSubscriptionResumed(
    attributes: LemonSqueezyWebhookEvent['data']['attributes']
  ) {
    console.log('Resuming subscription:', {
      subscriptionId: attributes.subscription_id,
      attributes
    });

    await SubscriptionService.updateSubscription(
      attributes.subscription_id.toString(),
      {
        status: 'active',
        cancel_at: null,
      }
    );
  }

  private static async handleSubscriptionExpired(
    attributes: LemonSqueezyWebhookEvent['data']['attributes']
  ) {
    console.log('Expiring subscription:', {
      subscriptionId: attributes.subscription_id,
      attributes
    });

    await SubscriptionService.updateSubscription(
      attributes.subscription_id.toString(),
      {
        status: 'expired',
        current_period_end: attributes.ends_at || new Date().toISOString(),
      }
    );
  }

  private static async updateWebhookLogError(logId: string | undefined, errorMessage: string) {
    if (logId) {
      console.log('Updating webhook log error:', {
        logId,
        errorMessage
      });

      await supabaseAdmin
        .from('webhook_logs')
        .update({
          error: errorMessage,
          processed_at: new Date().toISOString()
        })
        .eq('id', logId);
    }
  }

  private static async forwardToMake(payload: LemonSqueezyWebhookEvent) {
    try {
      console.log('Forwarding webhook to Make.com');

      const response = await fetch(this.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Make.com webhook failed: ${response.statusText}`);
      }

      console.log('Successfully forwarded webhook to Make.com');
    } catch (error) {
      console.error('Error forwarding webhook to Make.com:', error);
      // Don't throw the error as this is not critical
    }
  }

  private static verifySignature(signature: string, payload: any): boolean {
    try {
      if (!signature || !this.WEBHOOK_SECRET) {
        console.error('Missing signature or webhook secret');
        return false;
      }

      const hmac = crypto.createHmac('sha256', this.WEBHOOK_SECRET);
      const digest = hmac.update(JSON.stringify(payload)).digest('hex');
      
      return signature === digest;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}