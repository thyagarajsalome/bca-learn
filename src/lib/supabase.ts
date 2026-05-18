import { createClient } from '@supabase/supabase-js';

// Astro requires the PUBLIC_ prefix for variables accessed on the client
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure they are prefixed with PUBLIC_');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);