import { SignupForm } from './signup-form';
import { LOGIN_URL } from '@/lib/env';

export const metadata = { title: 'Sign up · ClearBot' };

export default function SignupPage() {
  return (
    <article className="auth-card panel">
      <span className="bracket bracket-tl" />
      <span className="bracket bracket-br" />
      <header style={{ marginBottom: 20 }}>
        <a href="https://clearbot.io" className="mark" aria-label="ClearBot home" style={{ textDecoration: 'none' }}>
          <svg className="mark-logo" width={22} height={22} aria-hidden="true">
            <use href="#clearbot-logo" />
          </svg>
          <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>ClearBot</span>
        </a>
      </header>
      <h1 className="auth-title">
        <em>Create your</em> account.
      </h1>
      <p className="auth-sub">
        Access is invitation-only right now. Drop in your invite code, then pick a password or sign in with GitHub.
      </p>
      <SignupForm />
      <div className="auth-foot">
        <span>Already have an account?</span>
        <a href={LOGIN_URL}>Log in →</a>
      </div>
    </article>
  );
}
