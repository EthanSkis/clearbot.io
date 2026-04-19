'use client';
import { LOGIN_URL } from '@/lib/env';

export function SignOutButton() {
  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = LOGIN_URL;
  }
  return (
    <button type="button" onClick={signOut} style={{ background: 'transparent', border: 0, color: 'var(--cb-ink-dim)', cursor: 'pointer', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      Sign out
    </button>
  );
}
