import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

// Mirrors lib/supabase/middleware.ts: scope session cookies to the apex so
// they're readable on client/team subdomains after a login on login.clearbot.io.
async function pickCookieDomain(): Promise<string | undefined> {
  if (process.env.COOKIE_DOMAIN) return process.env.COOKIE_DOMAIN;
  const headerStore = await headers();
  const host = (headerStore.get('host') || '').split(':')[0].toLowerCase();
  if (host === 'clearbot.io' || host.endsWith('.clearbot.io')) return '.clearbot.io';
  return undefined;
}

// User-bound Supabase client for Server Components / Route Handlers.
// Honors RLS: auth.uid() == the signed-in user.
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  const cookieDomain = await pickCookieDomain();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (items: { name: string; value: string; options: CookieOptions }[]) => {
          items.forEach(({ name, value, options }) => {
            const opts: CookieOptions = { ...options, domain: cookieDomain };
            try { cookieStore.set({ name, value, ...opts }); } catch { /* Server Component read-only */ }
          });
        }
      }
    }
  );
}
