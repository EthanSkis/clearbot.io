'use client';
import { useState } from 'react';

type ProfileFields = {
  company_name?: string | null;
  primary_domain?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  timezone?: string | null;
  notif_deliverables?: boolean;
  notif_messages?: boolean;
  notif_invoices?: boolean;
  notif_digest?: boolean;
};

export function SettingsForm({ initial }: { initial: ProfileFields }) {
  const [p, setP] = useState<ProfileFields>(initial);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(p)
    });
    setBusy(false);
    if (!res.ok) { const body = await res.json().catch(() => ({})); setMsg({ kind: 'error', text: body.error || 'Save failed' }); return; }
    setMsg({ kind: 'ok', text: 'Saved.' });
  }

  const set = <K extends keyof ProfileFields>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setP((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
      <div className="form-row">
        <label>Company</label>
        <input value={p.company_name || ''} onChange={set('company_name')} />
      </div>
      <div className="form-row">
        <label>Primary domain</label>
        <input value={p.primary_domain || ''} onChange={set('primary_domain')} placeholder="example.com" />
      </div>
      <div className="form-row">
        <label>First name</label>
        <input value={p.first_name || ''} onChange={set('first_name')} />
      </div>
      <div className="form-row">
        <label>Last name</label>
        <input value={p.last_name || ''} onChange={set('last_name')} />
      </div>
      <div className="form-row">
        <label>Timezone</label>
        <input value={p.timezone || ''} onChange={set('timezone')} placeholder="America/New_York" />
      </div>
      <fieldset style={{ border: 0, padding: 0, marginTop: 12 }}>
        <legend style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--cb-ink-dim)', marginBottom: 8 }}>Notifications</legend>
        <div className="form-row check"><input id="nd" type="checkbox" checked={!!p.notif_deliverables} onChange={set('notif_deliverables')} /><label htmlFor="nd">Deliverable updates</label></div>
        <div className="form-row check"><input id="nm" type="checkbox" checked={!!p.notif_messages} onChange={set('notif_messages')} /><label htmlFor="nm">New messages</label></div>
        <div className="form-row check"><input id="ni" type="checkbox" checked={!!p.notif_invoices} onChange={set('notif_invoices')} /><label htmlFor="ni">Invoice events</label></div>
        <div className="form-row check"><input id="ng" type="checkbox" checked={!!p.notif_digest} onChange={set('notif_digest')} /><label htmlFor="ng">Weekly digest</label></div>
      </fieldset>
      {msg && <div className={`form-msg ${msg.kind}`}>{msg.text}</div>}
      <button className="primary-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
    </form>
  );
}
