import 'server-only';
import { renderShell } from './shell';
import { CLIENT_URL } from '@/lib/env';

type MessageInput = {
  recipientFirstName?: string | null;
  senderLabel: string;
  threadTitle?: string | null;
  projectName?: string | null;
  preview: string;
};

export function renderNewMessage(input: MessageInput): { subject: string; html: string } {
  const greet = input.recipientFirstName ? input.recipientFirstName : 'there';
  const trimmedPreview = trimPreview(input.preview, 240);
  const meta: { label: string; value: string }[] = [
    { label: 'From', value: esc(input.senderLabel) },
  ];
  if (input.projectName) meta.push({ label: 'Project', value: esc(input.projectName) });

  const subject = input.threadTitle
    ? `New message · ${input.threadTitle}`
    : 'New message on your ClearBot project';

  const excerpt = `
    <div style="border-left: 2px solid #0a0b0d; padding: 4px 0 4px 16px; font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.65; letter-spacing: 0.01em; color: #0a0b0d; white-space: pre-wrap; word-break: break-word;">&ldquo;${esc(trimmedPreview)}&rdquo;</div>`;

  const html = renderShell({
    eyebrow: 'Messages',
    headlineEmphasis: `Hi ${greet},`,
    headline: 'you have a new message.',
    lede: `<em style="font-style: italic; color:#6f6d65;">${esc(input.senderLabel)}</em> just sent you a note${
      input.threadTitle ? ` on <em style="font-style: italic;">${esc(input.threadTitle)}</em>` : ''
    }. Here's the excerpt &mdash; open the thread to read the rest and reply.`,
    body: excerpt,
    meta,
    ctaLabel: 'Open thread',
    ctaHref: `${CLIENT_URL}/messages`,
  });
  return { subject, html };
}

type DeliverableInput = {
  recipientFirstName?: string | null;
  projectName?: string | null;
  deliverableName: string;
  fileType?: string | null;
  sizeLabel?: string | null;
  version?: string | null;
};

export function renderNewDeliverable(input: DeliverableInput): { subject: string; html: string } {
  const greet = input.recipientFirstName ? input.recipientFirstName : 'there';
  const meta: { label: string; value: string }[] = [];
  if (input.projectName) meta.push({ label: 'Project', value: esc(input.projectName) });
  if (input.fileType) meta.push({ label: 'File', value: esc(input.fileType) });
  if (input.version) meta.push({ label: 'Version', value: esc(input.version) });

  const subject = input.projectName
    ? `New deliverable · ${input.projectName}`
    : `New deliverable · ${input.deliverableName}`;

  const html = renderShell({
    eyebrow: 'Deliverables',
    headlineEmphasis: `Hi ${greet},`,
    headline: 'something new is ready to review.',
    lede: `We just shipped <em style="font-style: italic;">${esc(input.deliverableName)}</em>${
      input.projectName ? ` for <em style="font-style: italic;">${esc(input.projectName)}</em>` : ''
    }${input.sizeLabel ? ` &mdash; ${esc(input.sizeLabel)}` : ''}. It&rsquo;s waiting in your portal.`,
    meta,
    ctaLabel: 'View deliverable',
    ctaHref: `${CLIENT_URL}/`,
  });
  return { subject, html };
}

type InvoiceInput = {
  recipientFirstName?: string | null;
  number?: string | null;
  projectName?: string | null;
  amountCents?: number | null;
  dueAt?: string | null;
  pdfUrl?: string | null;
};

export function renderInvoiceIssued(input: InvoiceInput): { subject: string; html: string } {
  const greet = input.recipientFirstName ? input.recipientFirstName : 'there';
  const amount = formatAmount(input.amountCents);
  const due = formatDate(input.dueAt);
  const meta: { label: string; value: string }[] = [];
  if (input.number) meta.push({ label: 'Invoice', value: esc(input.number) });
  if (amount) meta.push({ label: 'Amount', value: amount });
  if (due) meta.push({ label: 'Due', value: due });

  const subject = input.number
    ? `Invoice ${input.number}${amount ? ` · ${amount}` : ''}`
    : 'New invoice from ClearBot';

  const html = renderShell({
    eyebrow: 'Billing',
    headlineEmphasis: `Hi ${greet},`,
    headline: 'a new invoice is ready.',
    lede: `We&rsquo;ve issued ${input.number ? `<em style="font-style: italic;">invoice ${esc(input.number)}</em>` : 'a new invoice'}${
      input.projectName ? ` for <em style="font-style: italic;">${esc(input.projectName)}</em>` : ''
    }. You can review and pay it through the secure link below.`,
    meta,
    ctaLabel: input.pdfUrl ? 'Open invoice' : 'View in portal',
    ctaHref: input.pdfUrl || `${CLIENT_URL}/invoices`,
  });
  return { subject, html };
}

function trimPreview(s: string, max: number): string {
  const normalized = s.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return normalized.slice(0, max - 1).trimEnd() + '…';
}

function formatAmount(cents?: number | null): string {
  if (cents == null || Number.isNaN(cents)) return '';
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
