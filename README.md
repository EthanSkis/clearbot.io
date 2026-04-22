# ClearBot (unified web app)

ClearBot is an AI-powered business license renewal platform for
multi-location operators. This repo hosts the single Next.js app that
serves every `*.clearbot.io` subdomain from one Vercel project:

| Host | Route group |
|---|---|
| `clearbot.io` / `www.clearbot.io` | `app/(marketing)` |
| `signup.clearbot.io` | `app/(signup)` |
| `login.clearbot.io` | `app/(login)` |
| `client.clearbot.io` | `app/(client)` |
| `team.clearbot.io` | `app/(team)` |

`middleware.ts` rewrites by Host header, so URLs stay clean
(`signup.clearbot.io/book` renders `app/(signup)/book/page.tsx`).

## Backend

All database + auth interactions go through `app/api/**` Route
Handlers instead of being called from the browser. Two Supabase
clients live in `lib/supabase/`:

- `server.ts` — user-bound, cookie-driven SSR client; honors RLS.
- `admin.ts` — service-role client for privileged ops (booking
  inserts, access-code consumption, admin booking mutations).
- `browser.ts` — used only to kick off OAuth PKCE redirects.

## Local dev

```bash
cp .env.example .env.local   # fill in SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

To test subdomain routing locally, add to `/etc/hosts`:

```
127.0.0.1 clearbot.localhost signup.clearbot.localhost login.clearbot.localhost client.clearbot.localhost team.clearbot.localhost
```

and visit e.g. `http://signup.clearbot.localhost:3000/book`.

## Deployment

On Vercel project settings → Domains, add all five hosts. DNS cutover
should be staged subdomain-by-subdomain (see PR description for the
order).
