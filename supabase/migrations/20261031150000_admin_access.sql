-- Admin access: who the admins are, and what they may do with stories.
-- Admin rows are added by hand (SQL editor), never through the public API.

-- 1. Admins ------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Users allowed into the admin area. Not readable or writable through the API.';

-- RLS on with no policies, and no grants: anon and authenticated can't touch it.
-- Only is_admin() (security definer) looks inside.
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

-- True when the logged-in user is an admin. Uses auth.uid() from the verified
-- login token, never a user id sent by the browser.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- Functions are executable by everyone by default. Only logged-in users need it
-- (the policies below, and the admin page asking "am I an admin?").
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2. Story access for admins --------------------------------------------------
-- The existing "Anyone can read published stories" policy stays as it is.
-- Policies add up, so admins see every row and everyone else still sees only
-- published ones.

grant insert, update, delete on public.stories to authenticated;

create policy "Admins can read every story"
  on public.stories for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can add stories"
  on public.stories for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can change stories"
  on public.stories for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- A published story must be unpublished before it can be deleted.
create policy "Admins can delete stories that are not published"
  on public.stories for delete
  to authenticated
  using ((select public.is_admin()) and status in ('pending', 'unpublished'));

-- 3. Publish date -------------------------------------------------------------
-- published_at is the date of the FIRST publish, so the home page order stays the
-- same when a story is unpublished and published again. The database sets it;
-- any value sent by the browser is ignored.

create function public.set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.published_at := null;
  else
    new.published_at := old.published_at;
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;

  return new;
end;
$$;

create trigger stories_set_published_at
  before insert or update on public.stories
  for each row execute function public.set_published_at();
