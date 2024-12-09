import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentService } from '../../services/payment.service';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PricingPlans } from './PricingPlans';

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
}

export function SubscriptionManager() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSubscription();
    }
  }, [user?.id]);

  const loadSubscription = async () => {
    if (!user?.id) return;
    
    try {
      const data = await PaymentService.getSubscription(user.id);
      setSubscription(data);
    } catch (error) {
      toast.error('Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.id || !confirm('Are you sure you want to cancel your subscription?')) return;

    setIsCanceling(true);
    try {
      await PaymentService.cancelSubscription(subscription.id);
      toast.success('Subscription canceled successfully');
      loadSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />;
  }

  if (showPlans) {
    return (
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Available Plans</h2>
            <button
              onClick={() => setShowPlans(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Overview
            </button>
          </div>
          <PricingPlans />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Subscription</h2>
        
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {subscription.plan_id.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Active until {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <CreditCard className="h-4 w-4" />
              <span>Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowPlans(true)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Plan
              </button>
              {subscription.status === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Subscription</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by selecting a subscription plan.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowPlans(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}