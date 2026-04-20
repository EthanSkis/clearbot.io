import { supabase, LOGIN_URL } from './supabase.js';

const REDIRECT_KEY = 'portal_redirect';
const TEAM_URL = 'https://team.clearbot.io';

export async function requireSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data || !data.session) {
    try {
      const here = location.pathname + location.search;
      if (here && here !== '/' && here !== '/index.html') {
        localStorage.setItem(REDIRECT_KEY, here);
      }
    } catch (_) {}
    location.replace(LOGIN_URL);
    return null;
  }
  // Team members belong on team.clearbot.io, not the client portal.
  // Show a visible interstitial first, with a "stay here" escape hatch —
  // silent cross-subdomain jumps leave the user wondering what happened.
  try {
    const { data: prof } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', data.session.user.id)
      .maybeSingle();
    const role = ((prof && prof.role) || '').toLowerCase();
    if (role === 'admin' || role === 'team') {
      return await showTeamRedirectInterstitial(data.session);
    }
  } catch (_) { /* fail open: stay on client portal */ }
  return data.session;
}

/**
 * Render a brief interstitial when we're about to bounce an admin/team user
 * from the client portal over to the team dashboard. Auto-redirects after a
 * short countdown, but also lets the user choose to stay if the routing is
 * wrong for them.
 *
 * Returns the session if the user chooses "Stay here", or null if we redirect.
 */
function showTeamRedirectInterstitial(session) {
  return new Promise((resolve) => {
    const COUNTDOWN_SECONDS = 4;

    document.documentElement.setAttribute('data-auth', 'signed-in');

    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-label', 'Redirecting to team dashboard');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:24px',
      'background:rgba(5,6,8,0.78)',
      'backdrop-filter:blur(12px)',
      '-webkit-backdrop-filter:blur(12px)',
      'font-family:"JetBrains Mono",ui-monospace,Menlo,monospace',
      'color:#f3f1ea',
    ].join(';');

    overlay.innerHTML =
      '<div style="' +
        'position:relative;max-width:440px;width:100%;padding:36px 36px 28px;' +
        'background:#101114;border:1px solid rgba(243,241,234,0.16);border-radius:2px;' +
        'box-shadow:0 30px 80px rgba(0,0,0,0.55);">' +
        '<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.24em;color:#8a8880;margin-bottom:10px;">' +
          'Routing \u00b7 Team member detected' +
        '</div>' +
        '<h1 style="font-family:\'Fraunces\',serif;font-weight:400;font-size:28px;line-height:1.15;letter-spacing:-0.015em;margin:0 0 10px;">' +
          'Taking you to the <em style="font-style:italic;font-weight:300;color:#8a8880;">team dashboard</em>\u2026' +
        '</h1>' +
        '<p style="font-family:\'Fraunces\',serif;font-weight:300;font-size:15px;line-height:1.55;color:#8a8880;margin:0 0 22px;">' +
          'Your account has a team role, so this signs you in at ' +
          '<span style="color:#f3f1ea;">team.clearbot.io</span> instead of the client portal.' +
        '</p>' +
        '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">' +
          '<button type="button" data-continue ' +
            'style="appearance:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.2em;' +
            'padding:11px 20px;border:0;border-radius:2px;background:#ffffff;color:#0a0b0d;">' +
            'Continue to team (<span data-countdown>' + COUNTDOWN_SECONDS + '</span>)' +
          '</button>' +
          '<button type="button" data-stay ' +
            'style="appearance:none;cursor:pointer;font-family:inherit;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.18em;' +
            'padding:11px 20px;border:1px solid rgba(243,241,234,0.16);border-radius:2px;background:transparent;color:#f3f1ea;">' +
            'Stay on client portal' +
          '</button>' +
        '</div>' +
        '<p style="margin:18px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#3a3a38;">' +
          'Wrong account? ' +
          '<a href="' + LOGIN_URL + '" style="color:#8a8880;text-decoration:underline;text-underline-offset:3px;">Sign out and switch</a>' +
        '</p>' +
      '</div>';

    document.body.appendChild(overlay);

    const countdownEl = overlay.querySelector('[data-countdown]');
    const continueBtn = overlay.querySelector('[data-continue]');
    const stayBtn     = overlay.querySelector('[data-stay]');

    let remaining = COUNTDOWN_SECONDS;
    let timer = null;

    const cleanup = () => {
      if (timer) { clearInterval(timer); timer = null; }
      overlay.remove();
    };

    const goTeam = () => {
      cleanup();
      location.replace(TEAM_URL);
      resolve(null);
    };

    const stayHere = () => {
      cleanup();
      resolve(session);
    };

    timer = setInterval(() => {
      remaining--;
      if (countdownEl) countdownEl.textContent = remaining;
      if (remaining <= 0) goTeam();
    }, 1000);

    continueBtn.addEventListener('click', goTeam);
    stayBtn.addEventListener('click', stayHere);
    stayBtn.focus();
  });
}

export function consumeStoredRedirect() {
  try {
    const stored = localStorage.getItem(REDIRECT_KEY);
    if (!stored) return null;
    localStorage.removeItem(REDIRECT_KEY);
    // Only allow same-origin relative paths
    if (!stored.startsWith('/')) return null;
    const here = location.pathname + location.search;
    if (stored === here) return null;
    return stored;
  } catch (_) {
    return null;
  }
}

export async function signOut() {
  try { await supabase.auth.signOut(); } catch (_) {}
  try { localStorage.removeItem(REDIRECT_KEY); } catch (_) {}
  location.replace(LOGIN_URL);
}

export function displayName(user) {
  if (!user) return '';
  const m = user.user_metadata || {};
  return m.full_name || m.name || (user.email ? user.email.split('@')[0] : '') || '';
}

export function orgName(user) {
  if (!user) return 'Your Workspace';
  const m = user.user_metadata || {};
  if (m.org_name || m.organization) return m.org_name || m.organization;
  const name = displayName(user);
  if (name) return name;
  if (user.email) {
    const domain = user.email.split('@')[1];
    if (domain) {
      const first = domain.split('.')[0] || '';
      return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'Your Workspace';
    }
  }
  return 'Your Workspace';
}

export function initials(user) {
  const name = orgName(user);
  const parts = String(name).split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 2) || '?').toUpperCase();
}
