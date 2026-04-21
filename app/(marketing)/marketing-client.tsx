import Image from 'next/image';
import { SERVICES, PROCESS, COLLABORATORS, TIER_GROUPS, type Collaborator, type Service, type ServiceTier } from './automations';
import { SIGNUP_URL } from '@/lib/env';

const TIER_CODES: Record<ServiceTier, string> = {
  core:       'CORE',
  fast:       'T-01',
  production: 'T-02',
  specialty:  'T-03'
};

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

      {TIER_GROUPS.map((group) => {
        const items = SERVICES.filter((s) => s.tier === group.tier);
        if (items.length === 0) return null;
        return (
          <section className={`services-tier services-tier--${group.tier}`} key={group.tier}>
            <header className="services-tier-head">
              <span className="services-tier-code">{group.code}</span>
              <span className="services-tier-label">{group.label}</span>
              <span className="services-tier-blurb">{group.blurb}</span>
              <span className="services-tier-rule" />
            </header>
            <div className="services">
              {items.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </section>
        );
      })}

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

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const tierCode = TIER_CODES[service.tier];
  const showBrackets = service.tier === 'core';
  return (
    <article className={`service service--${service.tier}`}>
      {showBrackets && (
        <>
          <span className="bracket bracket-tl" aria-hidden="true" />
          <span className="bracket bracket-br" aria-hidden="true" />
        </>
      )}
      <div className="service-head">
        <span className="service-tier-tag">
          <span className="service-tier-code">{tierCode}</span>
          <span className="service-tier-sep">/</span>
          <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
        </span>
        <span className="meta">{service.meta}</span>
      </div>
      <h3 className="service-name">{service.name}</h3>
      <p className="service-body">{service.body}</p>
      <a
        className="service-cta"
        href={`${SIGNUP_URL}/book?focus=${encodeURIComponent(service.id)}`}
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
  );
}

function LogoMark({ collaborator }: { collaborator: Collaborator }) {
  return (
    <a
      className="logo-marquee-item"
      href={collaborator.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={collaborator.name}
    >
      <Image
        src={collaborator.logoSrc}
        alt=""
        width={280}
        height={88}
        className="logo-marquee-img"
        unoptimized
      />
    </a>
  );
}
