import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function GET(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get('limit') || '10'), 100);
  const projectId = url.searchParams.get('project_id');
  let query = supabase
    .from('activity')
    .select('id, text, project_name, unread, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error: qErr } = await query;
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ activity: data || [] });
}
