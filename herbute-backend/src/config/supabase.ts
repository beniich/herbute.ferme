import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// ensure env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[SUPABASE] ⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Supabase sync will be disabled.');
}

/**
 * Admin client for Supabase usage in the backend.
 * Uses the service role key to bypass RLS.
 */
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
