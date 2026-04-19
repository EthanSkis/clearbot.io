import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Bypasses RLS. Only use inside route handlers / server actions that
// have already authenticated + authorized the caller.
let cached: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Issue one from Supabase dashboard → Project Settings → API.'
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return cached;
}
