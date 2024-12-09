import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shlimczlhtlcpercytet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobGltY3psaHRsY3BlcmN5dGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MDk2MTMsImV4cCI6MjA0OTA4NTYxM30.F2FjW96daXYz5guyvkoUetdbW8iojxkafv1qYORFuZ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);