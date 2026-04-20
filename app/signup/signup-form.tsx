'use client';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { LOGIN_URL, SITE_URL } from '@/lib/env';

type Msg = { kind?: 'error' | 'ok'; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [terms, setTerms] = useState(false);

  const [codeVerified, setCodeVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeMsg, setCodeMsg] = useState<Msg>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  async function onVerifyCode() {
    setCodeMsg(null);
    const code = accessCode.trim();
    if (!code) {
      setCodeMsg({ kind: 'error', text: 'Enter your access code.' });
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-access-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ access_code: code }),
      });
      const body = await res.json().catch(() => ({} as { valid?: boolean; error?: string }));
      if (!res.ok || !body.valid) {
        setCodeMsg({ kind: 'error', text: body.error || 'Invalid or already-used access code.' });
        return;
      }
      setCodeVerified(true);
      setCodeMsg({ kind: 'ok', text: 'Access code accepted.' });
    } catch {
      setCodeMsg({ kind: 'error', text: 'Could not verify access code. Try again.' });
    } finally {
      setVerifying(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setNeedsEmailConfirm(false);

    if (!codeVerified) {
      setCodeMsg({ kind: 'error', text: 'Enter a valid access code first.' });
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setMsg({ kind: 'error', text: 'Enter a valid email address.' });
      return;
    }
    if (!password || password.length < 8) {
      setMsg({ kind: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setMsg({ kind: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (!terms) {
      setMsg({ kind: 'error', text: 'Please accept the Terms & Privacy to continue.' });
      return;
    }

    setBusy(true);
    setMsg({ text: 'Creating your account…' });

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        access_code: accessCode.trim(),
        email: trimmedEmail,
        password,
        terms_accepted: true,
      }),
    });
    const body = await res
      .json()
      .catch(() => ({} as { error?: string; needsEmailConfirm?: boolean; redirectTo?: string }));

    if (!res.ok) {
      setBusy(false);
      setMsg({ kind: 'error', text: body.error || 'Could not create account.' });
      return;
    }

    if (body.needsEmailConfirm) {
      setBusy(false);
      setMsg({ kind: 'ok', text: 'Check your inbox to confirm your email.' });
      setNeedsEmailConfirm(true);
      return;
    }

    setMsg({ kind: 'ok', text: 'Account created — redirecting…' });
    window.location.href = body.redirectTo ?? '/';
  }

  async function onGithub() {
    setBusy(true);
    setMsg({ text: 'Redirecting to GitHub…' });
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${SITE_URL}/api/auth/callback` },
    });
    if (error) {
      setBusy(false);
      setMsg({ kind: 'error', text: error.message || 'GitHub sign-up failed.' });
    }
  }

  const codeMsgClass = 'msg' + (codeMsg?.kind ? ` ${codeMsg.kind}` : '');
  const msgClass = 'msg' + (msg?.kind ? ` ${msg.kind}` : '');

  return (
    <>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="accessCode">
            <span>Access code</span>
          </label>
          <div className="input-wrap">
            <input
              id="accessCode"
              name="accessCode"
              type="text"
              placeholder="Enter your access code"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={codeVerified || verifying}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !codeVerified) {
                  e.preventDefault();
                  void onVerifyCode();
                }
              }}
            />
          </div>
        </div>

        {!codeVerified && (
          <>
            <button
              type="button"
              className="submit"
              onClick={onVerifyCode}
              disabled={verifying}
            >
              <span>{verifying ? 'Verifying…' : 'Continue'}</span>
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

            <div className={codeMsgClass} role="status" aria-live="polite">
              {codeMsg?.text ?? ''}
            </div>

            <div className="foot-note">
              Don&apos;t have an access code? <a href="/book">Book intro</a>
            </div>
          </>
        )}

        {codeVerified && (
          <>
            <div className={codeMsgClass} role="status" aria-live="polite">
              {codeMsg?.text ?? ''}
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

            <div className="field">
              <label htmlFor="password">
                <span>Password</span>
              </label>
              <div className="input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirm">
                <span>Confirm password</span>
              </label>
              <div className="input-wrap">
                <input
                  id="confirm"
                  name="confirm"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <label className="check">
                <input
                  type="checkbox"
                  name="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                />
                <span className="box" aria-hidden="true" />
                <span>I agree to the Terms &amp; Privacy</span>
              </label>
            </div>

            <button type="submit" className="submit" disabled={busy}>
              <span>{busy ? 'Creating account…' : 'Create Account'}</span>
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

            {needsEmailConfirm && (
              <div
                style={{
                  marginTop: 18,
                  padding: '14px 16px',
                  border: '1px solid var(--cb-rule-strong)',
                  borderRadius: 2,
                  background: 'rgba(243, 241, 234, 0.03)',
                  fontSize: 11,
                  color: 'var(--cb-ink-dim)',
                  lineHeight: 1.6,
                  letterSpacing: '0.02em',
                }}
              >
                <strong style={{ color: 'var(--cb-ink)', fontWeight: 500 }}>
                  Check your inbox.
                </strong>{' '}
                We sent a confirmation link to the email above. The link expires in 24 hours — if it&apos;s not in your inbox, check spam.
              </div>
            )}

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="sso">
              <button type="button" onClick={onGithub} disabled={busy}>
                <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.79.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
                  />
                </svg>
                GitHub
              </button>
            </div>
          </>
        )}
      </form>

      <div className="foot-note">
        Already have an account? <a href={LOGIN_URL}>Sign in</a>
      </div>
    </>
  );
}
