-- Adds two-sided unread tracking to message_threads and a trigger that
-- maintains the counters (plus preview/updated_at) whenever a message is
-- inserted. Run this in the Supabase SQL editor.
--
-- Conventions:
--   unread_count       -> messages the CLIENT has not read (sent by team)
--   unread_count_team  -> messages the TEAM has not read   (sent by client)

alter table public.message_threads
  add column if not exists unread_count_team integer not null default 0;

alter table public.message_threads
  alter column unread_count set default 0;

update public.message_threads set unread_count = 0 where unread_count is null;
update public.message_threads set unread_count_team = 0 where unread_count_team is null;

-- Trigger function: bump the right counter depending on who sent the message,
-- and keep the thread preview / updated_at in sync so the list stays fresh.
create or replace function public.handle_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  preview_text text;
begin
  preview_text := left(coalesce(NEW.body, ''), 140);

  if NEW.sender_role = 'team' then
    update public.message_threads
       set unread_count = coalesce(unread_count, 0) + 1,
           preview      = preview_text,
           updated_at   = now()
     where id = NEW.thread_id;
  elsif NEW.sender_role = 'client' then
    update public.message_threads
       set unread_count_team = coalesce(unread_count_team, 0) + 1,
           preview           = preview_text,
           updated_at        = now()
     where id = NEW.thread_id;
  else
    update public.message_threads
       set preview    = preview_text,
           updated_at = now()
     where id = NEW.thread_id;
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_message_insert on public.messages;
create trigger on_message_insert
after insert on public.messages
for each row execute function public.handle_new_message();

-- Backfill counters from any historical messages so existing threads show
-- realistic unread state the first time this migration runs.
with agg as (
  select thread_id,
         count(*) filter (where sender_role = 'team')   as team_msgs,
         count(*) filter (where sender_role = 'client') as client_msgs
    from public.messages
   group by thread_id
)
update public.message_threads t
   set unread_count      = greatest(coalesce(t.unread_count, 0),      agg.team_msgs),
       unread_count_team = greatest(coalesce(t.unread_count_team, 0), agg.client_msgs)
  from agg
 where t.id = agg.thread_id;
