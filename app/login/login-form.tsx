'use client';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { SITE_URL } from '@/lib/env';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [providerHint, setProviderHint] = useState<string[] | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setBusy(true); setProviderHint(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMsg({ kind: 'error', text: body.error || 'Log in failed' });
      try {
        const lookup = await fetch('/api/auth/providers-for-email', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const lookupBody = await lookup.json().catch(() => ({}));
        if (Array.isArray(lookupBody.providers) && lookupBody.providers.length) {
          setProviderHint(lookupBody.providers);
        }
      } catch { /* ignore */ }
      return;
    }
    window.location.href = body.redirectTo;
  }

  async function onGithub() {
    setBusy(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${SITE_URL}/api/auth/callback` }
    });
    if (error) {
      setMsg({ kind: 'error', text: error.message });
      setBusy(false);
    }
  }

  async function onReset() {
    if (!email) {
      setMsg({ kind: 'error', text: 'Enter your email first, then hit “Forgot password”.' });
      return;
    }
    setBusy(true); setMsg(null);
    await fetch('/api/auth/password-reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setBusy(false);
    setMsg({ kind: 'ok', text: 'If an account exists for that email, you’ll receive a reset link shortly.' });
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      <div className="form-row">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </div>
      {msg && <div className={`form-msg ${msg.kind}`}>{msg.text}</div>}
      {providerHint && providerHint.length > 0 && (
        <div className="form-msg" style={{ color: '#8a8880' }}>
          This email is linked to: {providerHint.join(', ')}. Try that provider below.
        </div>
      )}
      <button className="primary-btn" type="submit" disabled={busy} style={{ width: '100%' }}>
        {busy ? 'Working…' : 'Log in'}
      </button>
      <div style={{ marginTop: 10, textAlign: 'right' }}>
        <button type="button" onClick={onReset} style={{ background: 'transparent', border: 0, color: 'var(--cb-ink-dim)', cursor: 'pointer', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Forgot password?
        </button>
      </div>
      <div className="divider-rule">or</div>
      <button type="button" className="secondary-btn" onClick={onGithub} disabled={busy} style={{ width: '100%' }}>
        Continue with GitHub
      </button>
    </form>
  );
}
