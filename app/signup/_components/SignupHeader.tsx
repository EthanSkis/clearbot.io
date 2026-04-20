'use client';
import { usePathname } from 'next/navigation';

export function SignupHeader() {
  const pathname = usePathname() ?? '';
  const isBook = pathname === '/book' || pathname.endsWith('/book');
  const label = isBook ? 'Intro call / Intake' : 'Secure access / Member sign-up';

  return (
    <header className="bar" role="banner">
      <div className="bar-brand">
        <a className="mark" href="https://clearbot.io" aria-label="ClearBot home">
          <svg className="mark-logo" width={20} height={20} aria-hidden="true">
            <use href="#clearbot-logo" />
          </svg>
          <span>ClearBot</span>
        </a>
        <span className="bar-sep">/</span>
        <span className="bar-tag">{label}</span>
      </div>
      <div className="bar-actions">
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
  );
}
