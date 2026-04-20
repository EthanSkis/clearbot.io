import { SignupForm } from './signup-form';

export const metadata = { title: 'Sign up — ClearBot' };

export default function SignupPage() {
  return (
    <div className="stage">
      <svg className="ghost-logo" aria-hidden="true">
        <use href="#clearbot-logo" />
      </svg>

      <section className="card" aria-labelledby="signup-title">
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

        <h1 className="title" id="signup-title">
          <span className="italic">Create</span> account.
        </h1>
        <p className="subtitle">
          Join <em>ClearBot</em> and spin up your workspace.
        </p>

        <SignupForm />
      </section>
    </div>
  );
}
