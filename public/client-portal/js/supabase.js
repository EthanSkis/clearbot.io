import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL      = 'https://qunobrixpnerocdntkio.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_P-w2YUP5j2PcUPJrqZ3Xxg_Wk0BqSRu';
export const LOGIN_URL         = 'https://login.clearbot.io';

const COOKIE_DOMAIN = '.clearbot.io';
const MAX_COOKIE_CHARS = 3500;

function writeCookie(name, value) {
  document.cookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value) +
    '; Domain=' + COOKIE_DOMAIN +
    '; Path=/; Max-Age=31536000; Secure; SameSite=Lax';
}

function deleteCookie(name) {
  document.cookie =
    encodeURIComponent(name) + '=' +
    '; Domain=' + COOKIE_DOMAIN +
    '; Path=/; Max-Age=0; Secure; SameSite=Lax';
}

function readCookie(name) {
  const target = encodeURIComponent(name);
  const parts = document.cookie ? document.cookie.split('; ') : [];
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq < 0) continue;
    if (p.slice(0, eq) === target) {
      return decodeURIComponent(p.slice(eq + 1));
    }
  }
  return null;
}

function allCookieNames() {
  const parts = document.cookie ? document.cookie.split('; ') : [];
  const names = [];
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq < 0) continue;
    try { names.push(decodeURIComponent(p.slice(0, eq))); }
    catch (_) { names.push(p.slice(0, eq)); }
  }
  return names;
}

const crossDomainCookieStorage = {
  getItem(key) {
    if (readCookie(key + '.0') != null) {
      let result = '';
      let i = 0;
      let chunk;
      while ((chunk = readCookie(key + '.' + i)) != null) {
        result += chunk;
        i++;
      }
      return result;
    }
    return readCookie(key);
  },
  setItem(key, value) {
    this.removeItem(key);
    const s = String(value);
    if (s.length <= MAX_COOKIE_CHARS) {
      writeCookie(key, s);
      return;
    }
    let i = 0;
    for (let off = 0; off < s.length; off += MAX_COOKIE_CHARS) {
      writeCookie(key + '.' + i, s.slice(off, off + MAX_COOKIE_CHARS));
      i++;
    }
  },
  removeItem(key) {
    deleteCookie(key);
    for (const n of allCookieNames()) {
      if (n.startsWith(key + '.')) deleteCookie(n);
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: crossDomainCookieStorage,
  },
});
