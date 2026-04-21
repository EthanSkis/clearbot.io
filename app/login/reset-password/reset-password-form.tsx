'use client';
import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { CLIENT_URL, LOGIN_URL } from '@/lib/env';

type Msg = { kind?: 'error' | 'ok'; text: string } | null;

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  // `ready` flips true once we've confirmed a recovery session is active —
  // either by exchanging a fresh ?code= from the email link or by finding an
  // existing session cookie. Until then the form inputs stay disabled.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseBrowser();

    async function init() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        // Check for an existing session first — supabase-js runs
        // detectSessionInUrl on init, so by the time we read getSession()
        // the ?code= may already have been redeemed for us.
        let {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!session && code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (error) {
            setMsg({
              kind: 'error',
              text: 'This reset link has expired or was already used. Request a new one below.',
            });
            return;
          }
          ({
            data: { session },
          } = await supabase.auth.getSession());
          if (cancelled) return;
        }

        if (code) {
          // Strip the code so a refresh doesn't retry the exchange.
          url.searchParams.delete('code');
          window.history.replaceState(null, '', url.pathname + (url.search || ''));
        }

        if (!session) {
          setMsg({
            kind: 'error',
            text: 'No active recovery session. Click the link in your password reset email to start over.',
          });
          return;
        }
        setReady(true);
      } catch {
        if (!cancelled) {
          setMsg({
            kind: 'error',
            text: 'Could not start password reset. Request a new link and try again.',
          });
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!password || password.length < 8) {
      setMsg({ kind: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setMsg({ kind: 'error', text: 'Passwords do not match.' });
      return;
    }
    setBusy(true);
    setMsg({ text: 'Updating password…' });
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setBusy(false);
      setMsg({ kind: 'error', text: error.message || 'Could not update password.' });
      return;
    }
    setMsg({ kind: 'ok', text: 'Password updated. Redirecting…' });
    // The recovery session is now a regular session, so send them into the portal.
    // Middleware handles team/client role routing from there.
    window.setTimeout(() => {
      window.location.href = CLIENT_URL;
    }, 900);
  }

  const msgClass = 'msg' + (msg?.kind ? ` ${msg.kind}` : '');
  const disabled = !ready || busy;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="new-password">
          <span>New password</span>
          <button
            type="button"
            className="linklike"
            onClick={() => setShowPw((s) => !s)}
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        </label>
        <div className="input-wrap">
          <input
            id="new-password"
            name="password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••••••"
            autoComplete="new-password"
            required
            minLength={8}
            disabled={disabled}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="confirm-password">
          <span>Confirm password</span>
        </label>
        <div className="input-wrap">
          <input
            id="confirm-password"
            name="confirm"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••••••"
            autoComplete="new-password"
            required
            minLength={8}
            disabled={disabled}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="submit" disabled={disabled}>
        <span>{busy ? 'Updating…' : 'Update password'}</span>
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

      <div className="foot-note">
        Remembered it? <a href={LOGIN_URL}>Back to sign in</a>
      </div>
    </form>
  );
}
