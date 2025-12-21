import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a placeholder client if env vars are missing (prevents app crash)
// This allows the app to render and show helpful error messages
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
} else {
  // Create a dummy client that will throw helpful errors when used
  // Only warn in development
  if (import.meta.env.DEV) {
    console.warn(
      '⚠️ Missing Supabase environment variables!\n' +
      'Please create a .env file with:\n' +
      '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
      '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
      'The app will still load, but database features will not work.'
    );
  }
  
  // Create a client with placeholder values that will fail gracefully
  supabaseInstance = createClient<Database>(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY || 'placeholder-key',
    {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  );
}

// Export the client instance
export const supabase = supabaseInstance;

// Export a helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};