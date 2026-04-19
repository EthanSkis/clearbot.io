import { SIGNUP_URL, LOGIN_URL } from '@/lib/env';
import { MarketingHomeClient } from './marketing-client';

export default function MarketingHome() {
  return (
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
          <span className="bar-tag">Clear workflows. Clear results.</span>
        </div>
        <div className="bar-actions">
          <a className="ghost-btn" href={`${SIGNUP_URL}/book`}>Book intro</a>
          <a className="ghost-btn" href={SIGNUP_URL}>Sign up</a>
          <a className="login-btn" href={LOGIN_URL}>Login</a>
        </div>
      </header>

      <main>
        <section className="hero" id="workflows">
          <span className="eyebrow">
            <span className="pulse-dot" />
            Full-service creative agency · on autopilot
          </span>

          <h1 className="hero-headline">
            <span className="it">An agency </span>
            <span className="rm">run by bots.</span>{' '}
            <span className="it">Branded, shipped, </span>
            <span className="rm">in a week.</span>
          </h1>

          <p className="lede">
            Brand systems, websites, ad campaigns, content, video — the work a creative agency does, run by
            bots that don&rsquo;t sleep, don&rsquo;t drift off-brand, and don&rsquo;t bill you by the hour.{' '}
            <em>Clear workflows. Clear results.</em>
          </p>

          <MarketingHomeClient />
        </section>

        <div className="divider" id="contact">
          <span>§ 04 · Contact</span>
          <span className="divider-line" />
        </div>
        <article className="panel panel--cta">
          <span className="bracket bracket-tl" />
          <span className="bracket bracket-br" />
          <header className="panel-head">
            <span>INTAKE · CLEARBOT SYSTEMS</span>
            <span className="status-tag">
              <span className="pulse-dot" />
              <span>OPEN</span>
            </span>
          </header>
          <div className="cta-body">
            <div className="cta-copy">
              <h2 className="cta-title">
                <span className="it">Tell us what you need </span>
                <span className="rm">made.</span>
              </h2>
              <p className="cta-text">
                A 30-minute intro call is free. You leave with sample work in your brand, a workflow diagram, and a
                fixed monthly number — no hourly billing, ever.
              </p>
            </div>
            <div className="cta-actions">
              <a className="primary-btn" href={`${SIGNUP_URL}/book`}>
                Book intro call
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="email-link" href="mailto:ethan@clearbot.io">or · ethan@clearbot.io</a>
            </div>
          </div>
        </article>
      </main>

      <footer className="foot">
        <div className="foot-left">© 2026 ClearBot Systems</div>
        <div className="foot-mid">Creative work, run by bots.</div>
        <div className="foot-right">
          <a href={SIGNUP_URL}>Sign up</a>
          <a href="https://twitter.com/TheClearBot" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.linkedin.com/in/ethgrd/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://instagram.com/clearbot.io" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:ethan@clearbot.io">Contact</a>
          <a href={`${LOGIN_URL}/privacy`}>Privacy</a>
          <a href={`${LOGIN_URL}/terms`}>Terms</a>
        </div>
      </footer>
    </div>
  );
}
