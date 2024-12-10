import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentService } from '../../services/payment.service';
import { CreditCard, Shield, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PricingPlans } from './PricingPlans';
import { SubscriptionStatus } from '../../services/payment/types';

interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
}

export function SubscriptionManager() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadSubscription();
      loadCustomerPortal();
    }
  }, [user?.id]);

  const loadSubscription = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await PaymentService.getSubscription(user.id);
      console.log('Subscription data:', data);
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
      toast.error('Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomerPortal = async () => {
    try {
      const userId = user?.id;
      if (!userId) {
        console.log('No user ID found');
        return;
      }

      const url = await PaymentService.getCustomerPortalLink(userId);
      if (url) {
        setPortalUrl(url);
      }
    } catch (error) {
      console.error('Failed to load customer portal:', error);
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">
                  Status: {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
              {subscription.cardBrand && subscription.cardLastFour && (
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {subscription.cardBrand} ending in {subscription.cardLastFour}
                  </span>
                </div>
              )}
            </div>

            {subscription.currentPeriodEnd && (
              <div className="text-sm text-gray-500">
                Current period ends: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </div>
            )}

            {subscription.status === 'active' && (
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                {subscription.updatePaymentMethodUrl && (
                  <a
                    href={subscription.updatePaymentMethodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Payment Method
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              </div>
            )}

            {subscription.status === 'canceled' && (
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">
                  Your subscription will end on{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              You don't have an active subscription. Choose a plan to get started.
            </p>
            <button
              onClick={() => setShowPlans(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}