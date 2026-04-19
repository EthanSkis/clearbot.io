'use client';
import { createBrowserClient } from '@supabase/ssr';

// Thin client used only for OAuth kickoff (the PKCE flow mints its
// code verifier in the browser). All data reads + writes should go
// through our /api routes, not this.
let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (cached) return cached;
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return cached;
}
