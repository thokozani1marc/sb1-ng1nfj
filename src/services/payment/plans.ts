import { SubscriptionPlan } from './types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    variantId: '615476',
    name: 'Basic Monthly',
    description: 'Perfect for small families',
    price: 9.99,
    interval: 'monthly',
    features: [
      'Up to 2 children',
      'Basic activity tracking',
      'Email support',
    ],
  },
  {
    id: 'basic-yearly',
    variantId: '615482',
    name: 'Basic Yearly',
    description: 'Perfect for small families',
    price: 99.99,
    interval: 'yearly',
    features: [
      'Up to 2 children',
      'Basic activity tracking',
      'Email support',
      '2 months free',
    ],
  },
  {
    id: 'premium-monthly',
    variantId: '615487',
    name: 'Premium Monthly',
    description: 'Ideal for growing families',
    price: 19.99,
    interval: 'monthly',
    features: [
      'Unlimited children',
      'Advanced activity tracking',
      'Priority support',
      'Custom reports',
    ],
  },
  {
    id: 'premium-yearly',
    variantId: '615477',
    name: 'Premium Yearly',
    description: 'Ideal for growing families',
    price: 199.99,
    interval: 'yearly',
    features: [
      'Unlimited children',
      'Advanced activity tracking',
      'Priority support',
      'Custom reports',
      '2 months free',
    ],
  },
];