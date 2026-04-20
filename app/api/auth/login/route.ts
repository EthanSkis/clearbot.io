import { NextResponse } from 'next/server';
import { getSupabaseRouteClient } from '@/lib/supabase/server';
import { EmailPasswordSchema } from '@/lib/validation/auth';
import { CLIENT_URL, TEAM_URL } from '@/lib/env';

export async function POST(req: Request) {
  const parsed = EmailPasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials payload' }, { status: 400 });
  }

  // Build the response up front so signInWithPassword writes its
  // Set-Cookie headers directly onto the response we're about to return.
  // Going via cookies() from next/headers in a Route Handler has been
  // unreliable on Next 15 — cookies sometimes never make it onto the wire,
  // which left users authenticated on Supabase but cookieless in the browser
  // and bounced straight back to /login by the dashboard middleware.
  const res = NextResponse.json({ ok: true, redirectTo: CLIENT_URL });
  const supabase = getSupabaseRouteClient(req, res);

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Pick the right destination: team users land on team.clearbot.io,
  // everyone else goes to the client portal.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user!.id)
    .maybeSingle();
  const role = (profile?.role || '').toLowerCase();
  const redirectTo = role === 'admin' || role === 'team' ? TEAM_URL : CLIENT_URL;
  return NextResponse.json({ ok: true, redirectTo }, { headers: res.headers });
}
