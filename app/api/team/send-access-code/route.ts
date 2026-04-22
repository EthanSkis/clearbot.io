import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireTeamAdmin, errorResponse } from '@/lib/auth/require';
import { sendMail } from '@/lib/email/send';
import { renderAccessCodeEmail } from '@/lib/email/access-code';

const BodySchema = z.object({
  email: z.string().email().max(320),
  code: z.string().min(1).max(80),
  firstName: z.string().max(120).optional().nullable(),
});

export async function POST(req: Request) {
  const { admin, error } = await requireTeamAdmin();
  if (error || !admin) return errorResponse(error || { status: 500, message: 'Admin client unavailable' });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { email, code, firstName } = parsed.data;

  const { data: rawRow, error: lookupErr } = await admin
    .from('access_codes')
    .select('code, name')
    .eq('code', code)
    .maybeSingle();
  if (lookupErr) {
    return NextResponse.json({ error: lookupErr.message }, { status: 500 });
  }
  if (!rawRow) {
    return NextResponse.json({ error: 'Access code not found' }, { status: 404 });
  }
  const row = rawRow as { code: string; name: string | null };

  const resolvedFirstName = (firstName || deriveFirstName(row.name)).trim();
  const { subject, html } = renderAccessCodeEmail({
    firstName: resolvedFirstName,
    code: row.code,
  });

  const sent = await sendMail({ to: email, subject, html, tag: 'access-code' });
  if (!sent.ok) {
    return NextResponse.json({ error: sent.error || 'Failed to send email' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

function deriveFirstName(name: string | null | undefined): string {
  if (!name) return '';
  return name.trim().split(/\s+/)[0] || '';
}
