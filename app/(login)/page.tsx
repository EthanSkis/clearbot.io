import { LoginForm } from './login-form';
import { SIGNUP_URL } from '@/lib/env';

export const metadata = { title: 'Log in · ClearBot' };

export default function LoginPage() {
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
        <em>Welcome</em> back.
      </h1>
      <p className="auth-sub">Log in to pick up where you left off.</p>
      <LoginForm />
      <div className="auth-foot">
        <span>New here?</span>
        <a href={SIGNUP_URL}>Create an account →</a>
      </div>
    </article>
  );
}
