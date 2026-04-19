import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function GET(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const url = new URL(req.url);
  const threadId = url.searchParams.get('thread_id');
  if (!threadId) return NextResponse.json({ error: 'thread_id is required' }, { status: 400 });
  const { data, error: qErr } = await supabase
    .from('messages')
    .select('id, thread_id, sender_id, sender_role, body, created_at')
    .eq('thread_id', threadId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(500);
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}

export async function POST(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = typeof body.body === 'string' ? body.body.trim() : '';
  const threadId = typeof body.thread_id === 'string' ? body.thread_id : '';
  if (!text) return NextResponse.json({ error: 'Empty message' }, { status: 400 });
  if (!threadId) return NextResponse.json({ error: 'thread_id is required' }, { status: 400 });

  const { data, error: iErr } = await supabase
    .from('messages')
    .insert({ thread_id: threadId, user_id: user.id, sender_id: user.id, sender_role: 'client', body: text })
    .select('id, thread_id, sender_id, sender_role, body, created_at')
    .single();
  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: data });
}
