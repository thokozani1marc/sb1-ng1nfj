import { SUBSCRIPTION_PLANS } from './payment/plans';
import { createCheckoutSession } from './payment/lemon-squeezy';
import { getSubscriptionStatus, cancelSubscription } from './payment/subscription';
import type { SubscriptionPlan, CheckoutOptions } from './payment/types';

export class PaymentService {
  static getPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  static async createCheckout(planId: string, userId: string, email: string): Promise<string> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    const options: CheckoutOptions = {
      userId,
      planId: plan.variantId,
      email,
    };

    return createCheckoutSession(options);
  }

  static async getSubscription(userId: string) {
    return getSubscriptionStatus(userId);
  }

  static async cancelSubscription(subscriptionId: string) {
    return cancelSubscription(subscriptionId);
  }
}