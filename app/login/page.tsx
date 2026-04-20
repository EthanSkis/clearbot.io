import { LoginForm } from './login-form';

export const metadata = { title: 'Login — ClearBot' };

export default function LoginPage() {
  return (
    <div className="stage">
      <svg className="ghost-logo" aria-hidden="true">
        <use href="#clearbot-logo" />
      </svg>

      <section className="card" aria-labelledby="login-title">
        <span className="bracket bracket-tl" aria-hidden="true" />
        <span className="bracket bracket-br" aria-hidden="true" />

        <div className="card-head">
          <span>Session · 01</span>
          <span
            className="status-tag"
            title="Your password is sent over an encrypted HTTPS connection."
          >
            <span className="dot" aria-hidden="true" />
            Encrypted · HTTPS
          </span>
        </div>

        <h1 className="title" id="login-title">
          <span className="italic">Welcome</span> back.
        </h1>
        <p className="subtitle">
          Sign in to continue to your <em>ClearBot</em> workspace.
        </p>

        <LoginForm />
      </section>
    </div>
  );
}
