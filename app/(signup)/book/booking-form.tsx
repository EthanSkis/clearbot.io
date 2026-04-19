'use client';
import { useState } from 'react';

const FOCUS_OPTIONS = [
  { value: 'brand',   label: 'Brand systems' },
  { value: 'web',     label: 'Website or landing page' },
  { value: 'ads',     label: 'Ads and campaigns' },
  { value: 'content', label: 'Content engine' },
  { value: 'video',   label: 'Video and motion' },
  { value: 'other',   label: 'Something else' }
];

export function BookingForm() {
  const [state, setState] = useState({
    name: '', email: '', company: '', focus: '', notes: ''
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const timezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: state.name,
        email: state.email,
        company: state.company || null,
        focus: state.focus || null,
        notes: state.notes || null,
        timezone
      })
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setMsg({ kind: 'error', text: body.error || 'Could not submit booking. Try again?' });
      return;
    }
    setMsg({ kind: 'ok', text: 'Got it — we’ll reply within one business day.' });
    setState({ name: '', email: '', company: '', focus: '', notes: '' });
  }

  const field = (k: keyof typeof state) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setState((s) => ({ ...s, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="name">Your name</label>
        <input id="name" required value={state.name} onChange={field('name')} autoComplete="name" />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={state.email} onChange={field('email')} autoComplete="email" />
      </div>
      <div className="form-row">
        <label htmlFor="company">Company</label>
        <input id="company" value={state.company} onChange={field('company')} autoComplete="organization" />
      </div>
      <div className="form-row">
        <label htmlFor="focus">What’s the focus?</label>
        <select id="focus" value={state.focus} onChange={field('focus')}>
          <option value="">Pick one…</option>
          {FOCUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="notes">Anything else?</label>
        <textarea id="notes" rows={4} value={state.notes} onChange={field('notes')} />
      </div>
      {msg && <div className={`form-msg ${msg.kind}`}>{msg.text}</div>}
      <button className="primary-btn" type="submit" disabled={busy} style={{ width: '100%' }}>
        {busy ? 'Submitting…' : 'Request intro call'}
      </button>
    </form>
  );
}
