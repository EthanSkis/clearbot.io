import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/require';
import { LogoSprite } from '@/app/_components/LogoSprite';
import { LOGIN_URL, TEAM_URL } from '@/lib/env';
import { SignOutButton } from '../_components/SignOutButton';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, supabase, error } = await requireUser();
  if (error) redirect(LOGIN_URL);

  // Bounce team members over to team.clearbot.io.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();
  const role = (profile?.role || '').toLowerCase();
  if (role === 'admin' || role === 'team') {
    redirect(TEAM_URL);
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
            <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}>ClearBot · Portal</span>
          </a>
          <nav className="dash-nav">
            <Link href="/">Overview</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/deliverables">Deliverables</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/invoices">Invoices</Link>
            <Link href="/settings">Settings</Link>
            <SignOutButton />
          </nav>
        </div>
        {children}
      </div>
    </>
  );
}
