import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

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

export async function middleware(req: NextRequest) {
  const res = await updateSession(req);

  const host = req.headers.get('host') || '';
  const url = req.nextUrl;

  // API + static assets keep their literal paths regardless of host.
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
    return res;
  }

  const prefix = resolvePrefix(host);
  if (!prefix) return res; // apex → marketing (/)

  // If we're already on the right prefix, leave it alone — the user
  // might be poking at the app via `my-preview.vercel.app/signup/...`
  if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) return res;

  const rewritten = req.nextUrl.clone();
  rewritten.pathname = `${prefix}${url.pathname === '/' ? '' : url.pathname}`;
  return NextResponse.rewrite(rewritten, { headers: res.headers });
}

export const config = {
  // Let the middleware touch everything except Next internals + static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|.*\\..*).*)']
};
