import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireTeam } from '@/lib/auth/require';
import { LogoSprite } from '@/app/_components/LogoSprite';
import { LOGIN_URL, CLIENT_URL } from '@/lib/env';
import { SignOutButton } from '@/app/_components/SignOutButton';

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const { user, error } = await requireTeam();
  if (error) {
    if (error.status === 401) redirect(LOGIN_URL);
    redirect(CLIENT_URL);
  }

  return (
    <>
      <LogoSprite />
      <div className="dash-shell">
        <div className="dash-top">
          <a className="mark" href="/">
            <svg className="mark-logo" width={20} height={20} aria-hidden="true">
              <use href="#clearbot-logo" />
            </svg>
            <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>ClearBot · Team</span>
          </a>
          <nav className="dash-nav">
            <Link href="/">Overview</Link>
            <Link href="/bookings">Bookings</Link>
            <span style={{ color: 'var(--cb-ink-faint)' }}>{user!.email}</span>
            <SignOutButton />
          </nav>
        </div>
        {children}
      </div>
    </>
  );
}
