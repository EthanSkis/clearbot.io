import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Login lives on login.clearbot.io but the dashboards live on client/team
// subdomains, so session cookies must be scoped to the apex. Honor the env
// override when present, otherwise auto-detect from the request host so a
// missing COOKIE_DOMAIN doesn't silently make cookies host-only and bounce
// users back to /login after sign-in.
function pickCookieDomain(req: NextRequest): string | undefined {
  if (process.env.COOKIE_DOMAIN) return process.env.COOKIE_DOMAIN;
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();
  if (host === 'clearbot.io' || host.endsWith('.clearbot.io')) return '.clearbot.io';
  return undefined;
}

// Called from middleware on every matched request so that Supabase's
// session cookies stay fresh. Without this, server components read a
// stale session right after login / token refresh.
export async function updateSession(req: NextRequest): Promise<{
  res: NextResponse;
  supabase: SupabaseClient;
  userId: string | null;
}> {
  const res = NextResponse.next({ request: { headers: req.headers } });
  const cookieDomain = pickCookieDomain(req);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (items: { name: string; value: string; options: CookieOptions }[]) => {
          items.forEach(({ name, value, options }) => {
            const opts: CookieOptions = { ...options, domain: cookieDomain };
            req.cookies.set({ name, value, ...opts });
            res.cookies.set({ name, value, ...opts });
          });
        }
      }
    }
  );

  // Touching getUser() forces a refresh if the access token is near expiry.
  const { data } = await supabase.auth.getUser();
  return { res, supabase, userId: data.user?.id ?? null };
}
