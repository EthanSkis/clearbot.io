import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { PasswordResetSchema } from '@/lib/validation/auth';
import { CLIENT_URL } from '@/lib/env';

export async function POST(req: Request) {
  const parsed = PasswordResetSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const supabase = await getSupabaseServer();
  // We intentionally swallow "user not found" errors so the endpoint
  // can't be used to enumerate which emails have accounts.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: CLIENT_URL });
  return NextResponse.json({ ok: true });
}
