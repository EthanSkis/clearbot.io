export const metadata = { title: 'Privacy · ClearBot' };

// Placeholder stub: the full legal copy still lives in the old
// login.clearbot.io/privacy.html. Port the canonical content here
// before cutover.
export default function PrivacyPage() {
  return (
    <article className="auth-card panel" style={{ maxWidth: 720 }}>
      <h1 className="auth-title">Privacy Policy</h1>
      <p className="auth-sub">
        We collect only what’s needed to run your account and deliver creative work: your name, email, company,
        and anything you explicitly upload. We don’t sell data. We don’t run ad-network pixels.
      </p>
      <p className="auth-sub">
        Questions? Email <a href="mailto:ethan@clearbot.io">ethan@clearbot.io</a>.
      </p>
    </article>
  );
}
