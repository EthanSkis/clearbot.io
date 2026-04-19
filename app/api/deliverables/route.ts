import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function GET(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const url = new URL(req.url);
  const projectId = url.searchParams.get('project_id');
  let query = supabase
    .from('deliverables')
    .select('id, project_id, project_name, name, file_type, size_label, status, version, url, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error: qErr } = await query;
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ deliverables: data || [] });
}
