'use client';
import { useEffect, useState } from 'react';
import { Fireworks } from './fireworks';

type Msg = { kind?: 'error' | 'ok'; text: string } | null;

type Slot = { iso: string; day: string; date: string; time: string };

const FOCUS_OPTIONS = [
  { value: 'brand',   label: 'Brand system' },
  { value: 'web',     label: 'Website or landing page' },
  { value: 'rescue',  label: 'Website rescue' },
  { value: 'copy',    label: 'Landing-page copy' },
  { value: 'audit',   label: 'Site & brand audit' },
  { value: 'naming',  label: 'Naming & taglines' },
  { value: 'ads',     label: 'Ads & campaigns' },
  { value: 'content', label: 'Content engine' },
  { value: 'video',   label: 'Motion & video' },
  { value: 'deck',    label: 'Pitch-deck design' },
  { value: 'icons',   label: 'Illustration & icons' },
  { value: 'other',   label: 'Something else' },
] as const;

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIMES = [
  { h: 10, m: 0 },
  { h: 11, m: 30 },
  { h: 14, m: 0 },
  { h: 15, m: 30 },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatTime(h: number, m: number) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, '0')} ${suffix}`;
}

function generateSlots(): Slot[] {
  const slots: Slot[] = [];
  const now = new Date();
  let added = 0;
  let offset = 0;
  while (added < 6 && offset < 30) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      for (const t of TIMES) {
        if (added >= 6) break;
        const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.h, t.m);
        if (dt.getTime() <= now.getTime() + 60 * 60 * 1000) continue;
        slots.push({
          iso: dt.toISOString(),
          day: DAY_LABELS[dow],
          date: `${dt.getMonth() + 1}/${dt.getDate()}`,
          time: formatTime(t.h, t.m),
        });
        added++;
      }
    }
    offset++;
  }
  return slots;
}

function formatSlotLabel(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return iso;
  }
}

export function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [focus, setFocus] = useState('');
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [success, setSuccess] = useState<{ firstName: string; slotText: string } | null>(null);

  const [timezone, setTimezone] = useState<string | null>(null);
  const [tzLabel, setTzLabel] = useState('Your local time');
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    setSlots(generateSlots());
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        setTimezone(tz);
        setTzLabel(tz.replace(/_/g, ' '));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const f = params.get('focus');
      if (f && FOCUS_OPTIONS.some((o) => o.value === f)) setFocus(f);
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!name.trim()) return setMsg({ kind: 'error', text: 'Enter your name.' });
    if (!email.trim() || !EMAIL_RE.test(email.trim()))
      return setMsg({ kind: 'error', text: 'Enter a valid email address.' });
    if (!focus) return setMsg({ kind: 'error', text: 'Pick what you are looking for.' });
    if (!slot) return setMsg({ kind: 'error', text: 'Pick a preferred time.' });
    if (!consent) return setMsg({ kind: 'error', text: 'Please check the email consent box.' });

    setBusy(true);
    setMsg({ text: 'Sending your request…' });

    const slotText = formatSlotLabel(slot);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        focus,
        preferred_slot: slot,
        preferred_slot_label: slotText,
        timezone,
        notes: notes.trim() || null,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({} as { error?: string }));
      setBusy(false);
      setMsg({
        kind: 'error',
        text:
          'Could not send your request: ' +
          (body.error || 'unknown error') +
          '. Email ethan@clearbot.io if this persists.',
      });
      return;
    }

    setMsg({ kind: 'ok', text: 'Request received.' });
    setSuccess({ firstName: name.trim().split(/\s+/)[0] || '', slotText });
  }

  const msgClass = 'msg' + (msg?.kind ? ` ${msg.kind}` : '');

  if (success) {
    return (
      <>
        <Fireworks />
        <span className="bracket bracket-tl" aria-hidden="true" />
        <span className="bracket bracket-br" aria-hidden="true" />
        <div className="card-head">
          <span>Intake · 02</span>
          <span className="status-tag">
            <span className="dot" aria-hidden="true" />
            Request received
          </span>
        </div>
        <h1 className="title">
          <span className="italic">Thanks</span>
          {success.firstName ? `, ${success.firstName}` : ''}.
        </h1>
        <p className="subtitle">
          We&rsquo;ll confirm your intro call by <em>email</em> within one business day.
        </p>
        <div className="bullets">
          <div className="bullet">
            <span className="k">Requested slot</span>
            <span className="v v--compact">{success.slotText || '—'}</span>
          </div>
          <div className="bullet">
            <span className="k">What happens next</span>
            <span className="v v--compact">Calendar invite + brief</span>
          </div>
          <div className="bullet">
            <span className="k">Need to change it?</span>
            <span className="v v--compact">Reply to the confirmation email</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="bracket bracket-tl" aria-hidden="true" />
      <span className="bracket bracket-br" aria-hidden="true" />
      <div className="card-head">
        <span>Intake · 01</span>
        <span className="status-tag">
          <span className="dot" aria-hidden="true" />
          Open for Bookings
        </span>
      </div>
      <h1 className="title" id="book-title">
        <span className="italic">Book</span> intro.
      </h1>
      <p className="subtitle">
        A 30-minute call to see what <em>ClearBot</em> can make for you.
      </p>

      <div className="bullets" aria-hidden="true">
        <div className="bullet">
          <span className="k">Runtime</span>
          <span className="v">
            <em>30</em> min
          </span>
        </div>
        <div className="bullet">
          <span className="k">Cost</span>
          <span className="v">
            <em>Free</em>
          </span>
        </div>
        <div className="bullet">
          <span className="k">You leave with</span>
          <span className="v">Sample work</span>
        </div>
      </div>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <div className="form-col">
            <div className="section-label">Contact</div>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="name">
                  <span>Name</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="email">
                  <span>Email</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="company">
                  <span>Company</span>
                  <span className="hint">Optional</span>
                </label>
                <div className="input-wrap">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Company or project"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="focus">
                  <span>Looking for</span>
                </label>
                <div className="input-wrap">
                  <select
                    id="focus"
                    name="focus"
                    required
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                  >
                    <option value="" disabled>
                      Select focus
                    </option>
                    {FOCUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="section-label">Pick a slot</div>
            <div className="field">
              <label>
                <span>Preferred time</span>
                <span className="hint">{tzLabel}</span>
              </label>
              <div className="slot-grid" role="radiogroup" aria-label="Preferred time">
                {slots.map((s, i) => (
                  <label className="slot" key={s.iso}>
                    <input
                      type="radio"
                      name="slot"
                      value={s.iso}
                      checked={slot === s.iso}
                      onChange={() => setSlot(s.iso)}
                      required={i === 0}
                    />
                    <span className="slot-face">
                      <span className="slot-day">
                        {s.day} · {s.date}
                      </span>
                      <span className="slot-time">{s.time}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-col">
            <div className="section-label">Brief</div>
            <div className="field brief-field">
              <label htmlFor="notes">
                <span>What do you need made?</span>
                <span className="hint">Optional</span>
              </label>
              <div className="input-wrap">
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="A few lines on the project, timeline, or budget."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <label className="check">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span className="box" aria-hidden="true" />
                <span>OK to email me call details</span>
              </label>
            </div>

            <button type="submit" className="submit" disabled={busy}>
              <span>{busy ? 'Submitting…' : 'Request intro call'}</span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className={msgClass} role="status" aria-live="polite">
              {msg?.text ?? ''}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
