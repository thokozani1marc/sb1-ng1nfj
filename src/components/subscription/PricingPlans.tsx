import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentService } from '../../services/payment.service';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { SubscriptionPlan } from '../../services/payment/types';

export function PricingPlans() {
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const plans = PaymentService.getPlans().filter(plan => plan.interval === billingInterval);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user?.id || !user.email) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setIsLoading(true);
    setProcessingPlanId(plan.id);
    
    try {
      const checkoutUrl = await PaymentService.createCheckout(
        plan.id,
        user.id,
        user.email
      );
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
      setProcessingPlanId(null);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for your family
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              className={`flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                billingInterval === 'monthly'
                  ? 'bg-white shadow'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setBillingInterval('monthly')}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={`ml-0.5 flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                billingInterval === 'yearly'
                  ? 'bg-white shadow'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setBillingInterval('yearly')}
            >
              Yearly billing
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 grid max-w-lg grid-cols-1 gap-8 mx-auto lg:max-w-4xl lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.id.includes('premium') && (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /{plan.interval}
                  </span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading}
                className={`mt-8 block rounded-md px-3.5 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isLoading && processingPlanId === plan.id ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  plan.id.includes('premium')
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {isLoading && processingPlanId === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}