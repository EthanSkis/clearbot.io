import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const Schema = z.object({ access_code: z.string().min(1).max(80) });

// Read-only sibling of consume_access_code: checks validity without
// burning the code, so the signup form can gate the email/password step
// on a real server check instead of a client-side stub.
export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: 'Invalid payload' }, { status: 400 });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.rpc('verify_access_code', { code_input: parsed.data.access_code });
  if (error) {
    return NextResponse.json({ valid: false, error: 'Could not validate access code' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ valid: false, error: 'Invalid or already-used access code' }, { status: 403 });
  }
  return NextResponse.json({ valid: true });
}
