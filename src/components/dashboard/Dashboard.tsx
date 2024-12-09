import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { ProfileSection } from '../profile/ProfileSection';
import { ActivityFeed } from '../activity/ActivityFeed';
import { SubscriptionManager } from '../subscription/SubscriptionManager';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProfileSection />
              <SubscriptionManager />
            </div>
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}