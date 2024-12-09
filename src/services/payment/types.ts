export interface SubscriptionPlan {
  id: string;
  variantId: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface CheckoutOptions {
  userId: string;
  planId: string;
  email: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface SubscriptionStatus {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAt?: string;
}