import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

// Mirrors lib/supabase/middleware.ts: scope session cookies to the apex so
// they're readable on client/team subdomains after a login on login.clearbot.io.
function pickCookieDomainFromHost(host: string | null | undefined): string | undefined {
  if (process.env.COOKIE_DOMAIN) return process.env.COOKIE_DOMAIN;
  const normalized = (host || '').split(':')[0].toLowerCase();
  if (normalized === 'clearbot.io' || normalized.endsWith('.clearbot.io')) return '.clearbot.io';
  return undefined;
}

async function pickCookieDomain(): Promise<string | undefined> {
  if (process.env.COOKIE_DOMAIN) return process.env.COOKIE_DOMAIN;
  const headerStore = await headers();
  return pickCookieDomainFromHost(headerStore.get('host'));
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

// Route Handler-only client that writes session cookies directly onto the
// supplied NextResponse. Use this whenever an endpoint needs to mint or
// refresh a session (login, callback, etc.) so the Set-Cookie headers are
// guaranteed to ride out on the JSON / redirect response — bypassing any
// quirks of cookies() from next/headers in Route Handlers.
export function getSupabaseRouteClient(req: Request, res: NextResponse): SupabaseClient {
  const reqCookies = parseRequestCookies(req.headers.get('cookie'));
  const cookieDomain = pickCookieDomainFromHost(req.headers.get('host'));
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => reqCookies,
        setAll: (items: { name: string; value: string; options: CookieOptions }[]) => {
          items.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options, domain: cookieDomain });
          });
        }
      }
    }
  );
}

function parseRequestCookies(header: string | null): { name: string; value: string }[] {
  if (!header) return [];
  return header.split(';').map((p) => {
    const eq = p.indexOf('=');
    if (eq < 0) return { name: p.trim(), value: '' };
    return { name: p.slice(0, eq).trim(), value: decodeURIComponent(p.slice(eq + 1).trim()) };
  });
}
