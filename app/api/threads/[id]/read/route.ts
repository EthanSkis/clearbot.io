import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const { error: qErr } = await supabase
    .from('message_threads')
    .update({ unread_count: 0, client_last_read_at: new Date().toISOString() })
    .eq('id', id);
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
