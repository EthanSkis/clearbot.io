import { LogoSprite } from '@/app/_components/LogoSprite';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
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
      {children}
    </>
  );
}
