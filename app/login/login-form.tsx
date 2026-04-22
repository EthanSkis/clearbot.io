'use client';
import { useRef, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { SIGNUP_URL, SITE_URL } from '@/lib/env';

type Msg = { kind?: 'error' | 'ok'; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  const [githubSuggested, setGithubSuggested] = useState(false);
  const lastBlurredEmail = useRef<string>('');

  function clearHint() {
    if (githubSuggested) setGithubSuggested(false);
  }

  async function lookupProviders(addr: string): Promise<string[] | null> {
    try {
      const res = await fetch('/api/auth/providers-for-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: addr })
      });
      const body = await res.json().catch(() => ({}));
      return Array.isArray(body.providers) ? body.providers : null;
    } catch {
      return null;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    clearHint();

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      setMsg({ kind: 'error', text: 'Enter a valid email address.' });
      return;
    }
    if (!password || password.length < 8) {
      setMsg({ kind: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    setBusy(true);
    setMsg({ text: 'Authenticating…' });

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: trimmed, password })
    });
    const body = await res.json().catch(() => ({} as { error?: string; redirectTo?: string }));

    if (!res.ok) {
      setBusy(false);
      const providers = await lookupProviders(trimmed);
      const githubOnly = !!providers && providers.includes('github') && !providers.includes('email');
      if (githubOnly) {
        setMsg({ kind: 'error', text: 'This account uses GitHub. Use “Continue with GitHub” below.' });
        setGithubSuggested(true);
      } else {
        setMsg({ kind: 'error', text: body.error || 'Incorrect email or password.' });
      }
      return;
    }

    setMsg({ kind: 'ok', text: 'Signed in — redirecting…' });
    window.location.href = body.redirectTo ?? '/';
  }

  async function onGithub() {
    clearHint();
    setBusy(true);
    setMsg({ text: 'Redirecting to GitHub…' });
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${SITE_URL}/api/auth/callback` }
    });
    if (error) {
      setBusy(false);
      setMsg({ kind: 'error', text: error.message || 'GitHub sign-in failed.' });
    }
  }

  async function onReset() {
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      setMsg({ kind: 'error', text: 'Enter your email first to reset your password.' });
      return;
    }
    setBusy(true);
    setMsg({ text: 'Sending reset link…' });
    const res = await fetch('/api/auth/password-reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: trimmed })
    });
    setBusy(false);
    if (!res.ok) {
      setMsg({ kind: 'error', text: 'Could not send reset link.' });
    } else {
      setMsg({
        kind: 'ok',
        text: 'Reset link sent — expires in 1 hour. Check spam if it doesn’t arrive in a minute.'
      });
    }
  }

  async function onEmailBlur() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !EMAIL_RE.test(trimmed)) return;
    if (trimmed === lastBlurredEmail.current) return;
    lastBlurredEmail.current = trimmed;
    const providers = await lookupProviders(trimmed);
    if (!providers) return;
    const githubOnly = providers.includes('github') && !providers.includes('email');
    if (githubOnly) {
      setMsg({ kind: 'ok', text: 'This account uses GitHub — use “Continue with GitHub” below.' });
      setGithubSuggested(true);
    }
  }

  const msgClass = 'msg' + (msg?.kind ? ` ${msg.kind}` : '');

  return (
    <>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="email"><span>Email</span></label>
          <div className="input-wrap">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearHint(); }}
              onBlur={onEmailBlur}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">
            <span>Password</span>
            <button
              type="button"
              className="linklike"
              onClick={onReset}
              disabled={busy}
            >
              Forgot?
            </button>
          </label>
          <div className="input-wrap">
            <input
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearHint(); }}
            />
            <button
              type="button"
              className="toggle"
              aria-label="Hold to show password"
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setShowPw(true); }}
              onPointerUp={() => setShowPw(false)}
              onPointerCancel={() => setShowPw(false)}
              onPointerLeave={() => setShowPw(false)}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowPw(true); } }}
              onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowPw(false); } }}
              onBlur={() => setShowPw(false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="row">
          <label className="check">
            <input
              type="checkbox"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="box" aria-hidden="true" />
            <span>Keep me signed in</span>
          </label>
        </div>

        <button type="submit" className="submit" disabled={busy}>
          <span>{busy ? 'Signing in…' : 'Sign In'}</span>
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
      </form>

      <div className="divider"><span>Or continue with</span></div>

      <div className="sso">
        <button
          type="button"
          className={githubSuggested ? 'suggested' : undefined}
          onClick={onGithub}
          disabled={busy}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.79.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
            />
          </svg>
          GitHub
        </button>
      </div>

      <div className="foot-note">
        New here? <a href={SIGNUP_URL}>Request access</a>
      </div>
    </>
  );
}
