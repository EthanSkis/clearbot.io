import { LogoSprite } from '@/app/_components/LogoSprite';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="login-page">
      <LogoSprite />
      <div className="amb amb-grid" aria-hidden="true" />
      <div className="amb amb-glow" aria-hidden="true" />
      <div className="amb amb-grain" aria-hidden="true" />

      <div className="shell">
        <header className="bar" role="banner">
          <div className="left">
            <a className="mark" href="https://clearbot.io" aria-label="ClearBot home">
              <svg className="mark-logo" width={22} height={22} aria-hidden="true">
                <use href="#clearbot-logo" />
              </svg>
              ClearBot
            </a>
            <span style={{ color: 'var(--cb-ink-faint)' }}>/</span>
            <span>Secure access / Member sign-in</span>
          </div>
          <div className="right">
            <a className="back-btn" href="https://clearbot.io">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19 12H5M11 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </a>
          </div>
        </header>

        <main>{children}</main>

        <footer className="foot">
          <div className="left">
            <span>© 2026 ClearBot Systems</span>
          </div>
          <div className="copyright">Clear workflows. Clear results.</div>
          <div className="right">
            <a href="https://clearbot.io">Home</a>
            <a href="mailto:ethan@clearbot.io">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
