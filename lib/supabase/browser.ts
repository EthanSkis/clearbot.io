'use client';
import { createBrowserClient } from '@supabase/ssr';

// Thin client used only for OAuth kickoff (the PKCE flow mints its
// code verifier in the browser). All data reads + writes should go
// through our /api routes, not this.

// PKCE writes the code verifier as a cookie. If it's host-only on the
// originating subdomain (e.g. signup.clearbot.io), the apex callback at
// clearbot.io/api/auth/callback can't read it and exchangeCodeForSession
// fails. Scope it to .clearbot.io so every subdomain sees it.
function pickCookieDomain(): string | undefined {
  if (process.env.NEXT_PUBLIC_COOKIE_DOMAIN) return process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (typeof window === 'undefined') return undefined;
  const host = window.location.hostname;
  if (host === 'clearbot.io' || host.endsWith('.clearbot.io')) return '.clearbot.io';
  return undefined;
}

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (cached) return cached;
  const domain = pickCookieDomain();
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    domain ? { cookieOptions: { domain } } : undefined
  );
  return cached;
}
