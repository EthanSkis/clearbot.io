-- Replaces the incrementing trigger from 0001 with a recompute-based one so
-- that if it (or any other legacy trigger) fires more than once per insert,
-- the final count is still correct. Tracks last-read timestamps per side.

alter table public.message_threads
  add column if not exists client_last_read_at timestamptz;

alter table public.message_threads
  add column if not exists team_last_read_at timestamptz;

create or replace function public.handle_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  preview_text text;
  client_base timestamptz;
  team_base   timestamptz;
begin
  preview_text := left(coalesce(NEW.body, ''), 140);

  select coalesce(client_last_read_at, 'epoch'::timestamptz),
         coalesce(team_last_read_at,   'epoch'::timestamptz)
    into client_base, team_base
    from public.message_threads
   where id = NEW.thread_id;

  update public.message_threads
     set unread_count = (
           select count(*)::int
             from public.messages m
            where m.thread_id = NEW.thread_id
              and m.sender_role = 'team'
              and m.created_at > client_base
         ),
         unread_count_team = (
           select count(*)::int
             from public.messages m
            where m.thread_id = NEW.thread_id
              and m.sender_role = 'client'
              and m.created_at > team_base
         ),
         preview    = preview_text,
         updated_at = now()
   where id = NEW.thread_id;

  return NEW;
end;
$$;

drop trigger if exists on_message_insert on public.messages;
create trigger on_message_insert
after insert on public.messages
for each row execute function public.handle_new_message();

-- One-time reset: previous runs may have left inflated counters from
-- double-firing triggers. Consider everything read right now; fresh unread
-- state accumulates from here.
update public.message_threads
   set client_last_read_at = now(),
       team_last_read_at   = now(),
       unread_count        = 0,
       unread_count_team   = 0;
