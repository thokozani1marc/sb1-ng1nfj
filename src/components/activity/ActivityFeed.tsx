import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface Activity {
  id: string;
  type: 'login' | 'profile_update' | 'settings_change';
  description: string;
  timestamp: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'login',
    description: 'Logged in from new device',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    type: 'profile_update',
    description: 'Updated profile information',
    timestamp: '2024-03-14T15:30:00Z',
  },
  {
    id: '3',
    type: 'settings_change',
    description: 'Changed notification settings',
    timestamp: '2024-03-13T09:15:00Z',
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ActivityFeed() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="flow-root">
        <ul className="-mb-8">
          {MOCK_ACTIVITIES.map((activity, idx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {idx !== MOCK_ACTIVITIES.length - 1 && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white">
                      <Clock className="h-4 w-4 text-indigo-600" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}