// S (SRP): This file's ONLY job is to create and export the Supabase client.
// D (DIP): All services depend on this abstraction, not on Supabase internals directly.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ghtnprmacaiwskbisuxr.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodG5wcm1hY2Fpd3NrYmlzdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4NTgyOTQsImV4cCI6MjEwMjQzNDI5NH0.fhMTCWW6pZKDNAhiZh4cIwf8UQMf3Mx17D2hJZJqfVY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,   // Bonus: auth state persistence
    detectSessionInUrl: false,
  },
});
