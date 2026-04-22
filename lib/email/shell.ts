import 'server-only';

// Branded HTML frame shared by every transactional notification. Mirrors
// the typography + ink/cream palette of the password reset email so the
// whole account-mail surface feels like one voice.

type ShellArgs = {
  eyebrow: string;
  headline: string;
  headlineEmphasis?: string;
  lede: string;
  // Optional block rendered directly under the lede, before the meta row
  // and CTA. Useful for inline quotes/excerpts that belong with the
  // narrative rather than after the button.
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  // Optional 2-column metadata row rendered under the lede. Labels are
  // mono/caps, values are Fraunces, matching the reset email's info strip.
  meta?: { label: string; value: string }[];
  // Optional closing paragraph in italic serif (sits above the signature).
  closing?: string;
};

export function renderShell(args: ShellArgs): string {
  const meta = args.meta?.length ? renderMetaRow(args.meta) : '';
  const body = args.body
    ? `
        <tr>
          <td class="px-inner" style="padding: 0 40px 28px 40px;">
            ${args.body}
          </td>
        </tr>`
    : '';
  const cta =
    args.ctaHref && args.ctaLabel
      ? `
        <tr>
          <td class="px-inner" align="left" style="padding: 8px 40px 32px 40px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate;">
              <tbody><tr>
                <td align="center" bgcolor="#0a0b0d" style="background:#0a0b0d; border-radius: 2px;">
                  <a href="${escape(args.ctaHref)}" class="cta" style="display: inline-block; padding: 16px 28px; font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.22em; color: #f3f1ea; text-decoration: none; border: 1px solid #0a0b0d; border-radius: 2px; mso-padding-alt: 16px 28px;">
                    ${escape(args.ctaLabel)} &nbsp;&rarr;
                  </a>
                </td>
              </tr></tbody>
            </table>
          </td>
        </tr>`
      : '';
  const closing = args.closing
    ? `
        <tr>
          <td class="px-inner" style="padding: 0 40px 24px 40px; font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 300; font-size: 15px; line-height: 1.55; color: #6f6d65;">
            ${args.closing}
          </td>
        </tr>`
    : '';

  const emph = args.headlineEmphasis
    ? `<em style="font-style: italic; font-weight: 300; color: #0a0b0d;">${escape(args.headlineEmphasis)}</em><br>`
    : '';

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escape(args.headline)}</title>
<style>
  @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap");
  a { color: #0a0b0d; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; text-decoration-color: rgba(10,11,13,0.35); }
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; }
    .px-outer { padding-left: 20px !important; padding-right: 20px !important; }
    .px-inner { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 34px !important; line-height: 1.05 !important; }
    .lede { font-size: 17px !important; }
    .stack { display: block !important; width: 100% !important; padding-bottom: 18px !important; }
    .stack-last { padding-bottom: 0 !important; }
    .cta { display: block !important; text-align: center !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background:#f3f1ea; color:#0a0b0d;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f1ea;">
  <tbody><tr>
    <td align="center" class="px-outer" style="padding: 40px 24px;">
      <table role="presentation" width="600" class="container" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background:#f3f1ea; border:1px solid rgba(10,11,13,0.10);">

        <tbody><tr>
          <td class="px-inner" style="padding: 24px 40px 22px 40px; border-bottom: 1px solid rgba(10,11,13,0.10); font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.18em; color: #0a0b0d;">
            <span style="color:#0a0b0d;">ClearBot</span>
            <span style="color:#b7b4ab; padding: 0 10px;">/</span>
            <span style="color:#6f6d65; font-weight: 400;">${escape(args.eyebrow)}</span>
          </td>
        </tr>

        <tr>
          <td class="px-inner" style="padding: 44px 40px 0 40px;">
            <h1 class="h1" style="margin: 0 0 22px 0; font-family: 'Fraunces', 'Times New Roman', Georgia, serif; font-weight: 400; font-size: 44px; line-height: 1.05; letter-spacing: -0.03em; color: #0a0b0d;">
              ${emph}${escape(args.headline)}
            </h1>
          </td>
        </tr>

        <tr>
          <td class="px-inner lede" style="padding: 0 40px 28px 40px; font-family: 'Fraunces', 'Times New Roman', Georgia, serif; font-weight: 300; font-size: 19px; line-height: 1.5; letter-spacing: -0.005em; color: #0a0b0d;">
            ${args.lede}
          </td>
        </tr>

        ${body}

        ${meta}

        ${cta}

        ${closing}

        <tr>
          <td class="px-inner" style="padding: 24px 40px 28px 40px; border-top: 1px solid rgba(10,11,13,0.10); font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; color: #6f6d65;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
              <td align="left" valign="top" style="color:#6f6d65;">
                ClearBot Solutions<br><span style="color:#b7b4ab;">mccall, id</span>
              </td>
              <td align="right" valign="top" style="color:#b7b4ab;">
                <a href="https://client.clearbot.io/settings" style="color:#6f6d65; text-decoration: none;">Manage emails</a><br>
                <span>Transactional &middot; Not promotional</span>
              </td>
            </tr></tbody></table>
          </td>
        </tr>

      </tbody></table>
    </td>
  </tr></tbody>
</table>
</body></html>`;
}

function renderMetaRow(meta: { label: string; value: string }[]): string {
  const width = meta.length > 1 ? Math.floor(100 / meta.length) : 100;
  const cells = meta
    .map((m, i) => {
      const last = i === meta.length - 1 ? ' stack-last' : '';
      const padRight = i === meta.length - 1 ? '0' : '12px';
      const padLeft = i === 0 ? '0' : '12px';
      return `
        <td class="stack${last}" width="${width}%" align="left" valign="top" style="padding: 0 ${padRight} 0 ${padLeft};">
          <div style="font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.22em; color: #b7b4ab; margin-bottom: 6px;">${escape(m.label)}</div>
          <div style="font-family: 'Fraunces', 'Times New Roman', Georgia, serif; font-weight: 400; font-size: 18px; letter-spacing: -0.01em; color: #0a0b0d; word-break: break-word;">${m.value}</div>
        </td>`;
    })
    .join('');
  return `
        <tr>
          <td class="px-inner" style="padding: 0 40px 30px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px dashed rgba(10,11,13,0.10); padding-top: 22px;">
              <tbody><tr>${cells}</tr></tbody>
            </table>
          </td>
        </tr>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
