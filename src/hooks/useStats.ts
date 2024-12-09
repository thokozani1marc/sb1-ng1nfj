import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalUsers: string;
  activeSessions: string;
  growthRate: string;
  engagement: string;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // For demo purposes, we'll generate some mock data
        // In a real app, you'd fetch this from your database
        setStats({
          totalUsers: usersCount?.toString() ?? '0',
          activeSessions: Math.floor(Math.random() * 1000).toString(),
          growthRate: `${(Math.random() * 20).toFixed(1)}%`,
          engagement: `${(Math.random() * 100).toFixed(1)}%`,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}