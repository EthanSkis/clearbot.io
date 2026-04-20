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

  // Use the redirect response itself as the cookie carrier so session
  // Set-Cookie headers minted by exchangeCodeForSession ride out on the
  // response we actually return. Location is patched once we pick dest.
  // (NextResponse.next() is a middleware primitive and its headers aren't
  // safe to splice onto a Route Handler redirect.)
  const res = NextResponse.redirect(CLIENT_URL);
  const supabase = getSupabaseRouteClient(req, res);

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session || !data.user) {
      return NextResponse.redirect(`${CLIENT_URL}?error=exchange_failed`);
    }

    const dest =
      next && next.startsWith('/')
        ? new URL(next, url.origin).toString()
        : await pickPostLoginUrl(supabase, data.user.id);

    res.headers.set('location', dest);
    return res;
  } catch {
    return NextResponse.redirect(`${CLIENT_URL}?error=callback_failed`);
  }
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
