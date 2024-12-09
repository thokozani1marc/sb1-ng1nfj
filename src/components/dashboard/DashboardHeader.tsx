import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export function DashboardHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={user?.avatar_url}
              alt={user?.name ?? ''}
              fallback={user?.name ?? user?.email ?? 'U'}
            />
            <span className="text-sm font-medium text-gray-700">
              {user?.name ?? user?.email}
            </span>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}