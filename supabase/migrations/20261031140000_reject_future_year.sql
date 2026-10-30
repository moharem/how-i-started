-- Reject a start year in the future. A check constraint can't use now(),
-- so a trigger does it on every insert and update.

create function public.reject_future_year_started()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.year_started > extract(year from now())::int then
    raise exception 'year_started cannot be in the future'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger stories_reject_future_year
  before insert or update of year_started on public.stories
  for each row execute function public.reject_future_year_started();
