export interface SubscriptionPlan {
  id: string;
  variantId: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly' | 'once-off' | 'semi-annual';
  features: string[];
  checkoutUrl?: string;
}

export interface CheckoutOptions {
  userId: string;
  planId: string;
  email: string;
  successUrl?: string;
  cancelUrl?: string;
  customData?: {
    user_id: string;
    plan_id: string;
  };
}

export interface SubscriptionStatus {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'expired';
  currentPeriodEnd: string;
  cancelAt?: string;
  cardBrand?: string;
  cardLastFour?: string;
  updatePaymentMethodUrl?: string;
}