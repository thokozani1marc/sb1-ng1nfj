import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentService } from '../../services/payment.service';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { SubscriptionPlan } from '../../services/payment/types';

export function PricingPlans() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const plans = PaymentService.getPlans();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user?.id || !user.email) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setIsLoading(true);
    setProcessingPlanId(plan.id);
    
    try {
      if (plan.checkoutUrl) {
        window.location.href = plan.checkoutUrl;
        return;
      }

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

  const formatInterval = (interval: string) => {
    switch (interval) {
      case 'semi-annual':
        return '6 months';
      case 'yearly':
        return 'year';
      case 'monthly':
        return 'month';
      default:
        return interval;
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Registration & Subscription</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Choose your plan
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Select the plan that best suits your needs
          </p>
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                    R {plan.price.toFixed(2)}
                  </span>
                  {plan.interval !== 'once-off' && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /{formatInterval(plan.interval)}
                    </span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-5 w-5 flex-none text-indigo-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading}
                className={`mt-8 block w-full rounded-md px-3 py-2.5 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isLoading && processingPlanId === plan.id 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-indigo-500'
                } bg-indigo-600 text-white focus-visible:outline-indigo-600 transition-colors duration-200`}
              >
                {isLoading && processingPlanId === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  plan.interval === 'once-off' ? 'Register Now' : 'Subscribe Now'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All plans include registration fee. Prices include VAT.</p>
        </div>
      </div>
    </div>
  );
}