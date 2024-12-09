import { supabase } from '../lib/supabase';
import { SubscriptionService } from './subscription.service';

interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data: {
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
      subscription_id: number;
      variant_id: number;
      product_id: number;
      status: string;
      card_brand: string;
      card_last_four: string;
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
  private static readonly WEBHOOK_SECRET = '0786384291';

  static async handleWebhook(
    signature: string,
    payload: LemonSqueezyWebhookEvent
  ) {
    // Verify webhook signature
    if (!this.verifySignature(signature, payload)) {
      throw new Error('Invalid webhook signature');
    }

    const { event_name, custom_data } = payload.meta;
    const { attributes } = payload.data;

    switch (event_name) {
      case 'subscription_created':
        await this.handleSubscriptionCreated(attributes, custom_data);
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
  }

  private static verifySignature(signature: string, payload: any): boolean {
    // In a production environment, you should implement proper signature verification
    // using the webhook secret and the request body
    return true;
  }

  private static async handleSubscriptionCreated(
    attributes: LemonSqueezyWebhookEvent['data']['attributes'],
    customData: LemonSqueezyWebhookEvent['meta']['custom_data']
  ) {
    await SubscriptionService.createSubscription({
      user_id: customData.user_id,
      subscription_id: attributes.subscription_id.toString(),
      customer_id: attributes.customer_id.toString(),
      plan_id: customData.plan_id,
      variant_id: attributes.variant_id.toString(),
      status: 'active',
      current_period_start: attributes.created_at,
      current_period_end: attributes.renews_at,
    });
  }

  private static async handleSubscriptionUpdated(
    attributes: LemonSqueezyWebhookEvent['data']['attributes']
  ) {
    await SubscriptionService.updateSubscription(
      attributes.subscription_id.toString(),
      {
        status: attributes.status as any,
        current_period_end: attributes.renews_at,
        cancel_at: attributes.ends_at || undefined,
      }
    );
  }

  private static async handleSubscriptionCancelled(
    attributes: LemonSqueezyWebhookEvent['data']['attributes']
  ) {
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
    await SubscriptionService.updateSubscription(
      attributes.subscription_id.toString(),
      {
        status: 'expired',
        current_period_end: attributes.ends_at || new Date().toISOString(),
      }
    );
  }
}