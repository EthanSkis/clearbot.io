'use client';
import { useMemo, useState } from 'react';

type Booking = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  focus: string | null;
  preferred_slot: string | null;
  preferred_slot_label: string | null;
  timezone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ['new', 'contacted', 'scheduled', 'dropped'] as const;

export function BookingsTable({ initial }: { initial: Booking[] }) {
  const [rows, setRows] = useState<Booking[]>(initial);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (!term) return true;
      return [r.name, r.email, r.company, r.focus].filter(Boolean).some((s) => String(s).toLowerCase().includes(term));
    });
  }, [rows, q, statusFilter]);

  async function setStatus(id: string, next: string) {
    setBusyId(id); setErr(null);
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: next })
    });
    setBusyId(null);
    if (!res.ok) { const b = await res.json().catch(() => ({})); setErr(b.error || 'Update failed'); return; }
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: next } : r)));
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this booking permanently?')) return;
    setBusyId(id); setErr(null);
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    setBusyId(null);
    if (!res.ok) { const b = await res.json().catch(() => ({})); setErr(b.error || 'Delete failed'); return; }
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  return (
    <section>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '0 0 18px' }}>
        <input placeholder="Search name, email, company…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 220, background: 'var(--cb-bg-inset)', color: 'var(--cb-ink)', border: '1px solid var(--cb-rule-strong)', padding: '10px 12px', borderRadius: 2, fontFamily: 'var(--cb-mono)', fontSize: 13 }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: 'var(--cb-bg-inset)', color: 'var(--cb-ink)', border: '1px solid var(--cb-rule-strong)', padding: '10px 12px', borderRadius: 2, fontFamily: 'var(--cb-mono)', fontSize: 13 }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {err && <div className="dash-error">{err}</div>}
      {filtered.length === 0 ? (
        <div className="dash-empty">No bookings match.</div>
      ) : (
        filtered.map((r) => (
          <div key={r.id} className="dash-card">
            <div className="meta">
              {new Date(r.created_at).toLocaleString()} · {r.status} · {r.focus || 'no focus'} · {r.company || '—'}
            </div>
            <h3>{r.name}</h3>
            <p style={{ color: 'var(--cb-ink-dim)', fontSize: 13 }}>
              <a href={`mailto:${r.email}`}>{r.email}</a>
              {r.preferred_slot_label ? ` · ${r.preferred_slot_label}` : ''}
              {r.timezone ? ` (${r.timezone})` : ''}
            </p>
            {r.notes && <p style={{ color: 'var(--cb-ink-dim)', fontSize: 13, marginTop: 8 }}>{r.notes}</p>}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {STATUSES.map((s) => (
                <button key={s} type="button" className="secondary-btn" disabled={busyId === r.id || r.status === s} onClick={() => setStatus(r.id, s)} style={{ padding: '8px 12px', fontSize: 10 }}>
                  → {s}
                </button>
              ))}
              <button type="button" className="secondary-btn" disabled={busyId === r.id} onClick={() => onDelete(r.id)} style={{ padding: '8px 12px', fontSize: 10, borderColor: '#ff8b7b', color: '#ff8b7b' }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
