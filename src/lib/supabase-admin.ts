import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('Initializing Supabase admin client:', {
  url: supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyLength: supabaseServiceKey?.length
});

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL');
if (!supabaseServiceKey) throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY');

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
  },
});

// Test the admin client
supabaseAdmin.auth.getUser().then(({ data, error }) => {
  if (error) {
    console.error('Supabase admin client error:', error);
  } else {
    console.log('Supabase admin client initialized successfully:', {
      role: data.user?.role,
      id: data.user?.id
    });
  }
});
