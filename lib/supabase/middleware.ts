import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

// Called from middleware on every matched request so that Supabase's
// session cookies stay fresh. Without this, server components read a
// stale session right after login / token refresh.
export async function updateSession(req: NextRequest): Promise<{
  res: NextResponse;
  supabase: SupabaseClient;
  userId: string | null;
}> {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (items: { name: string; value: string; options: CookieOptions }[]) => {
          items.forEach(({ name, value, options }) => {
            const opts: CookieOptions = { ...options, domain: COOKIE_DOMAIN };
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
