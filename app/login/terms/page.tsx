export const metadata = { title: 'Terms · ClearBot' };

export default function TermsPage() {
  return (
    <article className="auth-card panel" style={{ maxWidth: 720 }}>
      <h1 className="auth-title">Terms of Service</h1>
      <p className="auth-sub">
        By using ClearBot you agree to a monthly subscription for the services your plan includes. We deliver the
        work described in your intake; you own the final assets once your first invoice is paid. Either side can
        end the relationship with 30 days’ notice.
      </p>
      <p className="auth-sub">
        Questions? Email <a href="mailto:ethan@clearbot.io">ethan@clearbot.io</a>.
      </p>
    </article>
  );
}
