import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { ProfileSection } from '../profile/ProfileSection';
import { SubscriptionManager } from '../subscription/SubscriptionManager';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <main className="py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <ProfileSection />
            <SubscriptionManager />
          </div>
        </div>
      </main>
    </div>
  );
}