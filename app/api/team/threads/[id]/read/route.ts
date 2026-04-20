import { NextResponse } from 'next/server';
import { requireTeamAdmin, errorResponse } from '@/lib/auth/require';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { admin, error } = await requireTeamAdmin();
  if (error || !admin) return errorResponse(error || { status: 500, message: 'Admin client unavailable' });
  const { error: qErr } = await admin
    .from('message_threads')
    .update({ unread_count_team: 0, team_last_read_at: new Date().toISOString() })
    .eq('id', id);
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
