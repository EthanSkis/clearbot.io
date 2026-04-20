-- Tag projects and booking requests against the 11-service taxonomy
-- defined in app/(marketing)/automations.ts (mirrored in public/shared/services.js).
-- Values are string IDs like 'brand', 'web', 'rescue', 'copy', 'audit',
-- 'naming', 'ads', 'content', 'video', 'deck', 'icons'. Nullable; no FK —
-- the canonical list lives in app code.

alter table if exists public.projects
  add column if not exists service_id text;

alter table if exists public.booking_requests
  add column if not exists focus_service_id text;
