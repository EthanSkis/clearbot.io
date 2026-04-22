import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

// A thin nodemailer wrapper that reads SMTP credentials from the same
// environment Supabase Auth reads from (Zoho in our case). The sender
// address is always the same ethan@clearbot.io shown on auth emails so
// everything lands in one conversation thread in the recipient's inbox.

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  // Tag used for log breadcrumbs so we can tell which template went out
  // without dumping full bodies into logs.
  tag?: string;
};

let cached: Transporter | null = null;

function getTransport(): Transporter {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error(
      'SMTP_HOST / SMTP_USER / SMTP_PASS must be set to send notification email.'
    );
  }
  const port = Number(process.env.SMTP_PORT || 465);
  // 465 is implicit TLS; any other port assumes STARTTLS on top of plain.
  const secure = port === 465;
  cached = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return cached;
}

export function fromAddress(): string {
  return process.env.MAIL_FROM || 'ClearBot <ethan@clearbot.io>';
}

export async function sendMail(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  try {
    const transport = getTransport();
    await transport.sendMail({
      from: fromAddress(),
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text ?? stripHtml(args.html),
      replyTo: args.replyTo ?? 'ethan@clearbot.io',
      headers: {
        'X-Entity-Ref-ID': args.tag || 'clearbot-notification',
      },
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown SMTP error';
    console.error('[email] send failed', { tag: args.tag, to: args.to, error: msg });
    return { ok: false, error: msg };
  }
}

// Minimal HTML → plain-text fallback for the text/plain mime part. Good
// enough for inbox preview and accessibility; not a full converter.
function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/&middot;/g, '·')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
