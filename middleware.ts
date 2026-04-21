import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { LOGIN_URL, CLIENT_URL, TEAM_URL } from '@/lib/env';

// Route groups aren't URL segments, so we rewrite to the underlying
// segments (signup/, login/, client/, team/) keyed off the Host header.
// Keeping marketing at `/` means the apex domain stays clean.
const HOST_ROUTES: Record<string, string> = {
  'signup.clearbot.io': '/signup',
  'login.clearbot.io': '/login',
  'client.clearbot.io': '/client',
  'team.clearbot.io': '/team'
};

function resolvePrefix(host: string): string | null {
  const normalized = host.toLowerCase().split(':')[0];
  if (HOST_ROUTES[normalized]) return HOST_ROUTES[normalized];
  // Local dev + preview support: `signup.clearbot.localhost`, `signup.*.vercel.app`
  for (const [prodHost, prefix] of Object.entries(HOST_ROUTES)) {
    const sub = prodHost.split('.')[0];
    if (normalized.startsWith(`${sub}.`)) return prefix;
  }
  return null;
}

// Portal page maps: the path under /client or /team → the static HTML under
// public/client-portal or public/team-portal. Rewrites live in middleware
// (rather than next.config rewrites) so the auth + role gate runs first.
const CLIENT_PAGES: Record<string, string> = {
  '': 'index.html',
  '/': 'index.html',
  '/messages': 'messages.html',
  '/invoices': 'invoices.html',
  '/settings': 'settings.html'
};

const TEAM_PAGES: Record<string, string> = {
  '': 'index.html',
  '/': 'index.html',
  '/bookings': 'bookings.html'
};

export async function middleware(req: NextRequest) {
  const { res, supabase, userId } = await updateSession(req);

  const host = req.headers.get('host') || '';
  const url = req.nextUrl;

  // API + static assets keep their literal paths regardless of host.
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return res;
  }

  const hostPrefix = resolvePrefix(host);

  // Treat /client and /team as portal paths no matter which host served them,
  // so apex visits (clearbot.io/client/...) pick up the same auth gate and
  // static rewrite as the subdomain.
  const apexPortal =
    url.pathname === '/client' || url.pathname.startsWith('/client/')
      ? '/client'
      : url.pathname === '/team' || url.pathname.startsWith('/team/')
        ? '/team'
        : null;

  const prefix = hostPrefix ?? apexPortal;
  if (!prefix) return res; // apex → marketing (/)

  // Normalize the working pathname so we can match against HOST_ROUTES above
  // AND the portal-page maps below without double-prefixing.
  const alreadyPrefixed = url.pathname === prefix || url.pathname.startsWith(`${prefix}/`);
  const workingPath = alreadyPrefixed
    ? url.pathname.slice(prefix.length) || '/'
    : url.pathname;

  // Gate the client + team portals. Unauthenticated users bounce to login;
  // role mismatches bounce to the correct subdomain so everyone lands on
  // the dashboard their account actually has access to.
  if (prefix === '/client' || prefix === '/team') {
    if (!userId) {
      return NextResponse.redirect(LOGIN_URL, { headers: res.headers });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    const role = (profile?.role || '').toLowerCase();
    const isTeam = role === 'admin' || role === 'team';

    if (prefix === '/client' && isTeam) {
      return NextResponse.redirect(TEAM_URL, { headers: res.headers });
    }
    if (prefix === '/team' && !isTeam) {
      return NextResponse.redirect(CLIENT_URL, { headers: res.headers });
    }

    const pageMap = prefix === '/client' ? CLIENT_PAGES : TEAM_PAGES;
    const portalDir = prefix === '/client' ? 'client-portal' : 'team-portal';
    const mapped = pageMap[workingPath];
    if (mapped) {
      const rewritten = url.clone();
      rewritten.pathname = `/${portalDir}/${mapped}`;
      return NextResponse.rewrite(rewritten, { headers: res.headers });
    }
    // Unknown /client/* or /team/* path: fall through to 404.
    return res;
  }

  // Signup + login are still Next.js routes under app/(marketing)/...
  if (alreadyPrefixed) return res;

  const rewritten = req.nextUrl.clone();
  rewritten.pathname = `${prefix}${url.pathname === '/' ? '' : url.pathname}`;
  return NextResponse.rewrite(rewritten, { headers: res.headers });
}

export const config = {
  // Let the middleware touch everything except Next internals + static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|.*\\..*).*)']
};
