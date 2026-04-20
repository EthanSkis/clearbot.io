import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseRouteClient } from '@/lib/supabase/server';
import { CLIENT_URL, TEAM_URL } from '@/lib/env';

// OAuth (GitHub) + email confirm both land here. We exchange the `code`
// query param for a session cookie, then decide where to send the user.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next');

  if (!code) {
    return NextResponse.redirect(`${CLIENT_URL}?error=missing_code`);
  }

  // Carrier response so the session cookies set by exchangeCodeForSession
  // ride out on the redirect (see app/api/auth/login/route.ts for context).
  const carrier = NextResponse.next();
  const supabase = getSupabaseRouteClient(req, carrier);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    return NextResponse.redirect(`${CLIENT_URL}?error=exchange_failed`);
  }

  const dest =
    next && next.startsWith('/')
      ? new URL(next, url.origin).toString()
      : await pickPostLoginUrl(supabase, data.user!.id);

  return NextResponse.redirect(dest, { headers: carrier.headers });
}

async function pickPostLoginUrl(
  supabase: ReturnType<typeof getSupabaseRouteClient>,
  userId: string
): Promise<string> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  const role = (profile?.role || '').toLowerCase();
  return role === 'admin' || role === 'team' ? TEAM_URL : CLIENT_URL;
}
