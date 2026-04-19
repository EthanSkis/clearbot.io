import { NextResponse } from 'next/server';
import { requireUser, errorResponse } from '@/lib/auth/require';

export async function GET() {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const { data, error: qErr } = await supabase
    .from('projects')
    .select('id, name, description, status, progress, next_milestone, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  return NextResponse.json({ projects: data || [] });
}

export async function POST(req: Request) {
  const { user, supabase, error } = await requireUser();
  if (error) return errorResponse(error);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (typeof body.name !== 'string' || !body.name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  const { error: iErr } = await supabase.from('projects').insert({
    user_id: user.id,
    status: 'discovery',
    progress: 0,
    name: body.name,
    description: typeof body.description === 'string' ? body.description : null,
    updated_at: new Date().toISOString()
  });
  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
