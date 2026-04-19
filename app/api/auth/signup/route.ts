import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { SignupSchema } from '@/lib/validation/auth';
import { LOGIN_URL } from '@/lib/env';

export async function POST(req: Request) {
  const parsed = SignupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid signup payload' }, { status: 400 });
  }
  const { email, password, access_code } = parsed.data;

  // Gate: access code must be valid and unused. consume_access_code is a
  // SECURITY DEFINER RPC that atomically marks the code as consumed; we call
  // it with the service-role key so the caller can't bypass it.
  const admin = getSupabaseAdmin();
  const { data: codeOk, error: rpcErr } = await admin.rpc('consume_access_code', { code_input: access_code });
  if (rpcErr) {
    return NextResponse.json({ error: 'Could not validate access code' }, { status: 500 });
  }
  if (!codeOk) {
    return NextResponse.json({ error: 'Invalid or already-used access code' }, { status: 403 });
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${LOGIN_URL}` }
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const needsEmailConfirm = !data.session;
  return NextResponse.json({ ok: true, needsEmailConfirm });
}
