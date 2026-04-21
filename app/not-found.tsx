import type { Metadata } from 'next';
import { LogoSprite } from '@/app/_components/LogoSprite';

export const metadata: Metadata = {
  title: 'Not found · ClearBot',
  description: 'The page you were looking for does not exist.'
};

export default function NotFound() {
  return (
    <>
      <LogoSprite />
      <div className="amb amb-grid" aria-hidden="true" />
      <div className="amb amb-glow" aria-hidden="true" />
      <div className="amb amb-grain" aria-hidden="true" />
      <div className="amb amb-ghost" aria-hidden="true">
        <svg viewBox="0 0 1008 1008">
          <use href="#clearbot-logo" />
        </svg>
      </div>

      <div className="shell">
        <header className="bar" role="banner">
          <div className="bar-brand">
            <a className="mark" href="/" aria-label="ClearBot home">
              <svg className="mark-logo" width={20} height={20} aria-hidden="true">
                <use href="#clearbot-logo" />
              </svg>
              <span>ClearBot</span>
            </a>
            <span className="bar-sep">/</span>
            <span className="bar-tag">Page not found</span>
          </div>
        </header>

        <main>
          <section className="hero">
            <span className="eyebrow">
              <span className="pulse-dot" />
              Error · 404
            </span>

            <h1 className="hero-headline">
              <span className="it">Nothing here. </span>
              <span className="rm">Yet.</span>
            </h1>

            <p className="lede">
              The page you were looking for wandered off. Head back to the homepage and
              we&rsquo;ll get you where you need to go.{' '}
              <em>Your idea. Perfected.</em>
            </p>

            <div className="cta-actions" style={{ marginTop: 32 }}>
              <a className="primary-btn" href="/">
                Back to homepage
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a className="email-link" href="mailto:ethan@clearbot.io">or · ethan@clearbot.io</a>
            </div>
          </section>
        </main>

        <footer className="foot">
          <div className="foot-left">© 2026 ClearBot Solutions</div>
          <div className="foot-mid">Your idea. Perfected.</div>
        </footer>
      </div>
    </>
  );
}
