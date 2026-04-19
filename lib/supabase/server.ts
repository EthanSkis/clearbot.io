import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

// User-bound Supabase client for Server Components / Route Handlers.
// Honors RLS: auth.uid() == the signed-in user.
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (items) => {
          items.forEach(({ name, value, options }) => {
            const opts: CookieOptions = { ...options, domain: COOKIE_DOMAIN };
            try { cookieStore.set({ name, value, ...opts }); } catch { /* Server Component read-only */ }
          });
        }
      }
    }
  );
}
