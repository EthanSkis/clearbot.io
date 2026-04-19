import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { requireTeam, errorResponse } from '@/lib/auth/require';
import { BookingCreateSchema } from '@/lib/validation/bookings';

// Public booking submissions use the service-role client so we can
// keep the table read-closed to anon. The pg_notify trigger on the
// booking_requests table still fires for downstream email delivery.
export async function POST(req: Request) {
  const parsed = BookingCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload' }, { status: 400 });
  }
  const admin = getSupabaseAdmin();
  const { error } = await admin.from('booking_requests').insert({
    ...parsed.data,
    source: parsed.data.source || 'signup.clearbot.io/book'
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { error: authErr, supabase } = await requireTeam();
  if (authErr) return errorResponse(authErr);

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const q = url.searchParams.get('q');

  let query = supabase
    .from('booking_requests')
    .select('id, name, email, company, focus, preferred_slot, preferred_slot_label, timezone, notes, status, created_at')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`name.ilike.${term},email.ilike.${term},company.ilike.${term},focus.ilike.${term}`);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data || [] });
}
