import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
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

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    return NextResponse.redirect(`${CLIENT_URL}?error=exchange_failed`);
  }

  if (next && next.startsWith('/')) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user!.id)
    .maybeSingle();
  const role = (profile?.role || '').toLowerCase();
  return NextResponse.redirect(role === 'admin' || role === 'team' ? TEAM_URL : CLIENT_URL);
}
