import { SubscriptionPlan } from './types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'registration',
    variantId: '615476',
    name: 'Once-Off Registration',
    description: 'Perfect for small families',
    price: 300.00,
    interval: 'once-off',
    features: [
      'Up to 2 children',
      'Basic activity tracking',
      'Email support',
    ],
  },
  {
    id: 'monthly-subscription',
    variantId: '615477',
    name: 'Monthly Subscription',
    description: 'Ongoing access to all features',
    price: 600.00,
    interval: 'monthly',
    checkoutUrl: 'https://squre.lemonsqueezy.com/buy/4ae49098-8693-45a9-9f6b-bc9cd57fa7ab',
    features: [
      'Up to 2 children',
      'Full activity tracking',
      'Priority email support',
      'Advanced features',
    ],
  },
  {
    id: 'semi-annual-subscription',
    variantId: '615482',
    name: 'Semi-Annual Subscription',
    description: 'Best value for long-term commitment',
    price: 2500.00,
    interval: 'semi-annual',
    checkoutUrl: 'https://squre.lemonsqueezy.com/buy/a0012eb4-7a93-4bd8-898f-453e60691e1c',
    features: [
      'Up to 2 children',
      'Full activity tracking',
      'Priority email support',
      'Advanced features',
      'Save R1100 compared to monthly',
    ],
  },
  {
    id: 'annual-subscription',
    variantId: '615487',
    name: 'Annual Subscription',
    description: 'Maximum savings for yearly commitment',
    price: 4500.00,
    interval: 'yearly',
    checkoutUrl: 'https://squre.lemonsqueezy.com/buy/5755aacb-3714-4140-a7b3-e65eabc3746d',
    features: [
      'Up to 2 children',
      'Full activity tracking',
      'Priority email support',
      'Advanced features',
      'Save R2700 compared to monthly',
    ],
  },
];