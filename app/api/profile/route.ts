import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function GET() {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  return NextResponse.json({ profile: data || null, user: { id: user.id, email: user.email, meta: user.user_metadata } });
}

export async function PATCH(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const patch = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // Hard-stop self-promotion; the DB trigger guards this too but rejecting
  // earlier gives a clearer client-side error.
  delete patch.role;
  delete patch.user_id;
  const { error: upErr } = await supabase
    .from('profiles')
    .upsert({ user_id: user.id, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
