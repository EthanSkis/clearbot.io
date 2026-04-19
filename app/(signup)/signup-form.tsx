'use client';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { SITE_URL } from '@/lib/env';

export function SignupForm() {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!terms) {
      setMsg({ kind: 'error', text: 'You must accept the Terms and Privacy Policy.' });
      return;
    }
    setBusy(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ access_code: accessCode, email, password, terms_accepted: true })
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMsg({ kind: 'error', text: body.error || 'Signup failed' });
      return;
    }
    setMsg({
      kind: 'ok',
      text: body.needsEmailConfirm
        ? 'Check your email for a confirmation link. The link expires in 24 hours.'
        : 'Account created. Redirecting…'
    });
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

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="access">Access code</label>
        <input id="access" required value={accessCode} onChange={(e) => setAccessCode(e.target.value)} autoComplete="off" />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      <div className="form-row">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      </div>
      <div className="form-row check">
        <input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <label htmlFor="terms">
          I agree to the <a href="https://login.clearbot.io/terms">Terms</a> and <a href="https://login.clearbot.io/privacy">Privacy Policy</a>.
        </label>
      </div>
      {msg && <div className={`form-msg ${msg.kind}`}>{msg.text}</div>}
      <button className="primary-btn" type="submit" disabled={busy} style={{ width: '100%' }}>
        {busy ? 'Working…' : 'Create account'}
      </button>
      <div className="divider-rule">or</div>
      <button type="button" className="secondary-btn" onClick={onGithub} disabled={busy} style={{ width: '100%' }}>
        Sign up with GitHub
      </button>
    </form>
  );
}
