import { NextResponse } from 'next/server';
import { requireTeamAdmin, errorResponse } from '@/lib/auth/require';
import { BookingPatchSchema } from '@/lib/validation/bookings';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error: authErr, admin } = await requireTeamAdmin();
  if (authErr) return errorResponse(authErr);
  const parsed = BookingPatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid patch' }, { status: 400 });
  const { error } = await admin!.from('booking_requests').update(parsed.data).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error: authErr, admin } = await requireTeamAdmin();
  if (authErr) return errorResponse(authErr);
  const { error } = await admin!.from('booking_requests').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
