import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { sendMail } from '@/lib/email/send';
import {
  renderNewMessage,
  renderNewDeliverable,
  renderInvoiceIssued,
} from '@/lib/email/templates';

// Entry point for Supabase Database Webhooks. Configure a webhook per
// table (messages, deliverables, invoices) in Supabase Dashboard →
// Database → Webhooks, firing on INSERT, pointed at this URL, with an
// `X-Webhook-Secret` header equal to SUPABASE_WEBHOOK_SECRET.
//
// Auth is a shared secret in a header. We don't rely on Supabase JWTs
// here because the webhook fires from Postgres, not an end user.

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: Record<string, unknown> | null;
  old_record?: Record<string, unknown> | null;
};

type ProfileLookup = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  notif_messages: boolean | null;
  notif_deliverables: boolean | null;
  notif_invoices: boolean | null;
};

export async function POST(req: Request) {
  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!expected) {
    console.error('[hook] SUPABASE_WEBHOOK_SECRET is not set — refusing webhook');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }
  const got = req.headers.get('x-webhook-secret');
  if (got !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (payload.type !== 'INSERT' || !payload.record) {
    // We only care about insert events; ack everything else so Supabase
    // doesn't retry.
    return NextResponse.json({ ok: true, skipped: 'not-insert' });
  }

  try {
    switch (payload.table) {
      case 'messages':
        return await handleMessage(payload.record);
      case 'deliverables':
        return await handleDeliverable(payload.record);
      case 'invoices':
        return await handleInvoice(payload.record);
      default:
        return NextResponse.json({ ok: true, skipped: `unhandled-table:${payload.table}` });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('[hook] handler failed', { table: payload.table, error: msg });
    // Ack with 200 so Supabase doesn't storm us with retries for a
    // non-transient bug; the error is in our logs.
    return NextResponse.json({ ok: false, error: msg });
  }
}

async function handleMessage(record: Record<string, unknown>) {
  const threadOwnerId = str(record.user_id);
  const senderRole = str(record.sender_role);
  const body = str(record.body);

  // Client-sent messages notify the team inbox; team-sent messages
  // notify the client who owns the thread. We don't email senders
  // their own messages.
  if (senderRole === 'client') {
    const teamEmail = process.env.TEAM_EMAIL_FALLBACK;
    if (!teamEmail) return NextResponse.json({ ok: true, skipped: 'no-team-email' });
    const client = threadOwnerId ? await loadProfile(threadOwnerId) : null;
    const senderLabel = client?.first_name
      ? `${client.first_name} (client)`
      : client?.email || 'A client';
    const { subject, html } = renderNewMessage({
      recipientFirstName: 'team',
      senderLabel,
      preview: body,
    });
    const sent = await sendMail({ to: teamEmail, subject, html, tag: 'new-message-team' });
    return NextResponse.json({ ok: sent.ok });
  }

  if (senderRole === 'team' && threadOwnerId) {
    const recipient = await loadProfile(threadOwnerId);
    if (!recipient?.email) return NextResponse.json({ ok: true, skipped: 'no-email' });
    if (recipient.notif_messages === false) {
      return NextResponse.json({ ok: true, skipped: 'opt-out' });
    }
    const { subject, html } = renderNewMessage({
      recipientFirstName: recipient.first_name,
      senderLabel: 'ClearBot team',
      preview: body,
    });
    const sent = await sendMail({ to: recipient.email, subject, html, tag: 'new-message-client' });
    return NextResponse.json({ ok: sent.ok });
  }

  return NextResponse.json({ ok: true, skipped: 'unhandled-role' });
}

async function handleDeliverable(record: Record<string, unknown>) {
  const ownerId = str(record.user_id);
  if (!ownerId) return NextResponse.json({ ok: true, skipped: 'no-owner' });
  const recipient = await loadProfile(ownerId);
  if (!recipient?.email) return NextResponse.json({ ok: true, skipped: 'no-email' });
  if (recipient.notif_deliverables === false) {
    return NextResponse.json({ ok: true, skipped: 'opt-out' });
  }
  const { subject, html } = renderNewDeliverable({
    recipientFirstName: recipient.first_name,
    projectName: strOrNull(record.project_name),
    deliverableName: str(record.name) || 'New file',
    fileType: strOrNull(record.file_type),
    sizeLabel: strOrNull(record.size_label),
    version: strOrNull(record.version),
  });
  const sent = await sendMail({ to: recipient.email, subject, html, tag: 'deliverable' });
  return NextResponse.json({ ok: sent.ok });
}

async function handleInvoice(record: Record<string, unknown>) {
  const ownerId = str(record.user_id);
  if (!ownerId) return NextResponse.json({ ok: true, skipped: 'no-owner' });
  const recipient = await loadProfile(ownerId);
  if (!recipient?.email) return NextResponse.json({ ok: true, skipped: 'no-email' });
  if (recipient.notif_invoices === false) {
    return NextResponse.json({ ok: true, skipped: 'opt-out' });
  }
  const amountCents =
    typeof record.amount_cents === 'number' ? record.amount_cents : Number(record.amount_cents);
  const { subject, html } = renderInvoiceIssued({
    recipientFirstName: recipient.first_name,
    number: strOrNull(record.number),
    projectName: strOrNull(record.project_name),
    amountCents: Number.isFinite(amountCents) ? amountCents : null,
    dueAt: strOrNull(record.due_at),
    pdfUrl: strOrNull(record.pdf_url),
  });
  const sent = await sendMail({ to: recipient.email, subject, html, tag: 'invoice' });
  return NextResponse.json({ ok: sent.ok });
}

async function loadProfile(userId: string): Promise<ProfileLookup | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .select('user_id, email, first_name, notif_messages, notif_deliverables, notif_invoices')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as ProfileLookup;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}
function strOrNull(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}
