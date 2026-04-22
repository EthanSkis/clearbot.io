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
          <span className="bar-tag">Business license automation.</span>
        </div>
        <div className="bar-actions">
          <a className="ghost-btn bar-action-inline" href={`${SIGNUP_URL}/book`}>Book intro</a>
          <a className="ghost-btn bar-action-inline" href={SIGNUP_URL}>Sign up</a>
          <a className="login-btn" href={LOGIN_URL}>Login</a>
          <details className="bar-menu">
            <summary className="bar-menu-toggle" aria-label="More links">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="5" cy="12" r="1.6" fill="currentColor" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                <circle cx="19" cy="12" r="1.6" fill="currentColor" />
              </svg>
            </summary>
            <div className="bar-menu-dropdown" role="menu">
              <a role="menuitem" href={`${SIGNUP_URL}/book`}>Book intro</a>
              <a role="menuitem" href={SIGNUP_URL}>Sign up</a>
            </div>
          </details>
        </div>
      </header>

      <main>
        <section className="hero" id="workflows">
          <span className="eyebrow">
            <span className="pulse-dot" />
            License renewal automation · for multi-location operators
          </span>

          <h1 className="hero-headline">
            <span className="it">Every license. </span>
            <span className="rm">Never late.</span>
          </h1>

          <p className="lede">
            ClearBot tracks, prepares, and files business license renewals for every
            location you operate — across every agency, every jurisdiction, every form.{' '}
            <em>A missed renewal is no longer possible.</em>
          </p>

          <MarketingHomeClient />
        </section>

        <div className="divider" id="contact">
          <span>§ 03 · Contact</span>
          <span className="divider-line" />
        </div>
        <article className="panel panel--cta">
          <span className="bracket bracket-tl" />
          <span className="bracket bracket-br" />
          <header className="panel-head">
            <span>INTAKE · CLEARBOT</span>
            <span className="status-tag">
              <span className="pulse-dot" />
              <span>OPEN</span>
            </span>
          </header>
          <div className="cta-body">
            <div className="cta-copy">
              <h2 className="cta-title">
                <span className="it">Tell us about your </span>
                <span className="rm">locations.</span>
              </h2>
              <p className="cta-text">
                A 15-minute intro call is free. You&rsquo;ll leave with a map of every license we&rsquo;d manage
                for you, a renewal calendar, and a per-location price.
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
        <div className="foot-left">© 2026 ClearBot</div>
        <div className="foot-mid">Business license renewals, automated.</div>
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
