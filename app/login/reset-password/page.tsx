import { ResetPasswordForm } from './reset-password-form';

export const metadata = { title: 'Reset Password — ClearBot' };

export default function ResetPasswordPage() {
  return (
    <div className="stage">
      <svg className="ghost-logo" aria-hidden="true">
        <use href="#clearbot-logo" />
      </svg>

      <section className="card" aria-labelledby="reset-title">
        <span className="bracket bracket-tl" aria-hidden="true" />
        <span className="bracket bracket-br" aria-hidden="true" />

        <div className="card-head">
          <span>Recovery · 01</span>
          <span
            className="status-tag"
            title="Your password is sent over an encrypted HTTPS connection."
          >
            <span className="dot" aria-hidden="true" />
            Encrypted · HTTPS
          </span>
        </div>

        <h1 className="title" id="reset-title">
          <span className="italic">Set</span> a new password.
        </h1>
        <p className="subtitle">
          Pick something you haven&rsquo;t used before. The link in your email is single-use.
        </p>

        <ResetPasswordForm />
      </section>
    </div>
  );
}
