import Image from 'next/image';
import { SERVICES, PROCESS, COLLABORATORS } from './automations';
import { SIGNUP_URL } from '@/lib/env';

export function MarketingHomeClient() {
  return (
    <div>
      <div className="logo-marquee" aria-label="Collaborators">
        <div className="logo-marquee-row">
          {[...COLLABORATORS, ...COLLABORATORS, ...COLLABORATORS, ...COLLABORATORS].map((c, i) => (
            <LogoMark key={i} collaborator={c} />
          ))}
        </div>
      </div>

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
      width={280}
      height={88}
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
