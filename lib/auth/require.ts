import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export type AuthError = { status: number; message: string };

export async function requireUser() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return { user: null, supabase, error: { status: 401, message: 'Not authenticated' } as AuthError };
  }
  return { user: data.user, supabase, error: null };
}

// Team gate. Primary check: profiles.role in ('admin','team').
// Fallback: the TEAM_EMAIL_FALLBACK env var, to keep the bootstrap
// path working before the first admin row exists in profiles.
export async function requireTeam() {
  const { user, supabase, error } = await requireUser();
  if (error) return { user: null, supabase, error };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  const role = (profile?.role || '').toLowerCase();
  if (role === 'admin' || role === 'team') {
    return { user, supabase, error: null };
  }

  const fallback = (process.env.TEAM_EMAIL_FALLBACK || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (user.email && fallback.includes(user.email.toLowerCase())) {
    return { user, supabase, error: null };
  }

  return { user: null, supabase, error: { status: 403, message: 'Team role required' } as AuthError };
}

export function errorResponse(err: AuthError) {
  return Response.json({ error: err.message }, { status: err.status });
}

// Admin-only helper: exposes the service-role client after authz passes.
export async function requireTeamAdmin() {
  const res = await requireTeam();
  if (res.error) return { ...res, admin: null as ReturnType<typeof getSupabaseAdmin> | null };
  return { ...res, admin: getSupabaseAdmin() };
}
