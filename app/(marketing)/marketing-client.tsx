import Image from 'next/image';
import { SERVICES, PROCESS, COLLABORATORS } from './automations';
import { SIGNUP_URL } from '@/lib/env';

const MARQUEE_ROWS: readonly [typeof COLLABORATORS, typeof COLLABORATORS] = (() => {
  const midpoint = Math.ceil(COLLABORATORS.length / 2);
  return [COLLABORATORS.slice(0, midpoint), COLLABORATORS.slice(midpoint)] as const;
})();

export function MarketingHomeClient() {
  return (
    <div>
      <article className="panel panel--logos" aria-labelledby="collab-head">
        <span className="bracket bracket-tl" />
        <span className="bracket bracket-br" />
        <header className="panel-head">
          <span id="collab-head">COLLABORATORS · IN ROTATION</span>
          <span className="status-tag">
            <span className="pulse-dot" />
            <span>LIVE</span>
          </span>
        </header>
        <div className="logo-marquee" aria-hidden="true">
          {MARQUEE_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`logo-marquee-row logo-marquee-row--${rowIdx === 0 ? 'left' : 'right'}`}
            >
              {[...row, ...row, ...row].map((c, i) => (
                <LogoMark key={`${rowIdx}-${i}`} collaborator={c} />
              ))}
            </div>
          ))}
        </div>
        <footer className="panel-foot panel-foot--logos">
          <span>A short list of the people I’ve shipped work for.</span>
        </footer>
      </article>

      <div className="divider" id="services">
        <span>§ 01 · Services</span>
        <span className="divider-line" />
      </div>
      <div className="services">
        {SERVICES.map((s, i) => (
          <article className="service" key={s.id}>
            <div className="service-head">
              <span>SVC / {String(i + 1).padStart(2, '0')}</span>
              <span className="meta">{s.meta}</span>
            </div>
            <h3 className="service-name">{s.name}</h3>
            <p className="service-body">{s.body}</p>
            <a
              className="service-cta"
              href={`${SIGNUP_URL}/book?focus=${encodeURIComponent(s.id)}`}
            >
              Book a call about this
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </article>
        ))}
      </div>

      <div className="divider" id="process">
        <span>§ 02 · How I work</span>
        <span className="divider-line" />
      </div>
      <div className="process">
        {PROCESS.map((p) => (
          <div className="process-step" key={p.n}>
            <div className="process-n">{p.n}</div>
            <div className="process-name">{p.name}</div>
            <p className="process-body">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoMark({ collaborator }: { collaborator: { name: string; logoSrc: string; href?: string } }) {
  const content = (
    <Image
      src={collaborator.logoSrc}
      alt=""
      width={140}
      height={44}
      className="logo-marquee-img"
      unoptimized
    />
  );
  if (collaborator.href) {
    return (
      <a
        className="logo-marquee-item"
        href={collaborator.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={collaborator.name}
      >
        {content}
      </a>
    );
  }
  return (
    <span className="logo-marquee-item" aria-label={collaborator.name}>
      {content}
    </span>
  );
}
