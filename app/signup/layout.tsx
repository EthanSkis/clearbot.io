import { LogoSprite } from '@/app/_components/LogoSprite';
import { SignupHeader } from './_components/SignupHeader';

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="login-page">
      <LogoSprite />
      <div className="amb amb-grid" aria-hidden="true" />
      <div className="amb amb-glow" aria-hidden="true" />
      <div className="amb amb-grain" aria-hidden="true" />

      <div className="shell">
        <SignupHeader />

        <main>{children}</main>

        <footer className="foot">
          <div className="left">
            <span>© 2026 ClearBot Solutions</span>
          </div>
          <div className="copyright">Your idea. Perfected.</div>
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
