import { LogoSprite } from '@/app/_components/LogoSprite';

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LogoSprite />
      <div className="amb amb-grid" aria-hidden="true" />
      <div className="amb amb-glow" aria-hidden="true" />
      <div className="auth-shell">{children}</div>
    </>
  );
}
