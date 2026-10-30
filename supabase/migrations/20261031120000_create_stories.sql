-- Stories: one row per founder story.
-- Option values here must match src/data/options.ts (see "Synced constants" in AGENTS.md).

create table public.stories (
  id uuid primary key default gen_random_uuid(),

  -- Workflow
  status text not null default 'pending'
    check (status in ('pending', 'published', 'unpublished')),
  is_sample boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Language the story text is written in (decides text direction)
  lang text not null check (lang in ('ar', 'en')),

  -- Who and what
  business_name text not null check (length(trim(business_name)) between 1 and 120),
  founder_name text check (founder_name is null or length(founder_name) <= 120),
  industry text not null check (industry in (
    'food', 'fashion', 'tech', 'services', 'retail', 'education',
    'health_beauty', 'crafts', 'other'
  )),
  industry_other text check (industry_other is null or length(industry_other) <= 80),

  -- Where
  location_type text not null check (location_type in ('egypt', 'abroad')),
  governorate text check (governorate is null or governorate in (
    'cairo', 'giza', 'alexandria', 'qalyubia', 'sharqia', 'dakahlia', 'gharbia',
    'monufia', 'beheira', 'kafr_el_sheikh', 'damietta', 'port_said', 'ismailia',
    'suez', 'faiyum', 'beni_suef', 'minya', 'asyut', 'sohag', 'qena', 'luxor',
    'aswan', 'red_sea', 'new_valley', 'matrouh', 'north_sinai', 'south_sinai'
  )),
  city text check (city is null or length(city) <= 80),
  country text check (country is null or length(country) <= 80),

  -- Starting point
  year_started int not null check (year_started between 1950 and 2100),
  capital_range text not null check (capital_range in (
    'zero', 'under_10k', '10k_50k', '50k_200k', '200k_1m', '1m_plus'
  )),
  capital_exact numeric check (capital_exact is null or capital_exact >= 0),
  currency_note text check (currency_note is null or length(currency_note) <= 80),
  money_source text not null check (money_source in (
    'savings', 'family_friends', 'loan', 'investor', 'none', 'mixed'
  )),
  work_mode text not null check (work_mode in ('full_time', 'side')),
  kept_job boolean,
  team_size_start int check (team_size_start is null or team_size_start between 1 and 10000),

  -- Milestones
  months_to_revenue int not null check (months_to_revenue between 0 and 600),
  months_to_profit int check (months_to_profit is null or months_to_profit between 0 and 600),
  profit_not_yet boolean not null default false,
  outcome text not null check (outcome in (
    'profitable', 'not_profitable_yet', 'pivoted', 'closed'
  )),

  -- Today (optional)
  team_size_now int check (team_size_now is null or team_size_now between 0 and 100000),
  stage_now text check (stage_now is null or length(stage_now) <= 200),

  -- Story questions (free text)
  q_had text check (q_had is null or length(q_had) <= 5000),
  q_first_spend text check (q_first_spend is null or length(q_first_spend) <= 5000),
  q_hardest text check (q_hardest is null or length(q_hardest) <= 5000),
  q_first_customer text check (q_first_customer is null or length(q_first_customer) <= 5000),
  q_advice text check (q_advice is null or length(q_advice) <= 5000),

  -- Rules that span several columns
  constraint industry_other_needed check (
    industry <> 'other' or length(trim(coalesce(industry_other, ''))) > 0
  ),
  constraint location_complete check (
    (location_type = 'egypt' and governorate is not null)
    or (location_type = 'abroad' and governorate is null
        and length(trim(coalesce(country, ''))) > 0)
  ),
  constraint profit_consistent check (not (profit_not_yet and months_to_profit is not null)),
  constraint at_least_one_answer check (
    coalesce(nullif(trim(q_had), ''), nullif(trim(q_first_spend), ''),
             nullif(trim(q_hardest), ''), nullif(trim(q_first_customer), ''),
             nullif(trim(q_advice), '')) is not null
  ),
  constraint published_has_date check (status <> 'published' or published_at is not null)
);

comment on table public.stories is 'Founder starting stories. Readers see only published rows.';

create index stories_published_idx on public.stories (published_at desc)
  where status = 'published';

-- Keep updated_at current on every change.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger stories_set_updated_at
  before update on public.stories
  for each row execute function public.set_updated_at();

-- Security: readers can only read published stories. Nobody can write through the
-- public API yet; admin and founder write access come in later steps.
alter table public.stories enable row level security;

revoke all on public.stories from anon, authenticated;
grant select on public.stories to anon, authenticated;

create policy "Anyone can read published stories"
  on public.stories for select
  to anon, authenticated
  using (status = 'published');
