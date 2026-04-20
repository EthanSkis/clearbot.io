import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function GET() {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const { data, error: qErr } = await supabase
    .from('message_threads')
    .select('id, title, preview, project_name, unread_count, unread_count_team, status, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ threads: data || [] });
}

export async function POST(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'New thread';

  const { data: thread, error: tErr } = await supabase
    .from('message_threads')
    .insert({
      user_id: user.id,
      project_id: (body.project_id as string) || null,
      project_name: (body.project_name as string) || null,
      title,
      status: 'active'
    })
    .select('id, title, preview, project_name, unread_count, unread_count_team, status, updated_at')
    .single();
  if (tErr || !thread) return NextResponse.json({ error: tErr?.message || 'Thread create failed' }, { status: 500 });

  if (typeof body.first_message === 'string' && body.first_message.trim()) {
    const { error: mErr } = await supabase.from('messages').insert({
      thread_id: thread.id,
      user_id: user.id,
      sender_id: user.id,
      sender_role: 'client',
      body: body.first_message.trim()
    });
    if (mErr) return NextResponse.json({ thread, error: mErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, thread });
}
