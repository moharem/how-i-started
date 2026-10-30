-- Review fixes for public.stories.

-- A founder name of only spaces counts as empty: store null ("Anonymous") instead.
alter table public.stories drop constraint stories_founder_name_check;
alter table public.stories add constraint stories_founder_name_check check (
  founder_name is null or length(trim(founder_name)) between 1 and 120
);

-- Egypt stories have a governorate and no country; abroad stories have a country
-- and no governorate.
alter table public.stories drop constraint location_complete;
alter table public.stories add constraint location_complete check (
  (location_type = 'egypt' and governorate is not null and country is null)
  or (location_type = 'abroad' and governorate is null
      and length(trim(coalesce(country, ''))) > 0)
);

-- The optional exact amount must fall inside the chosen range.
-- Ranges include their lower bound and exclude their upper bound.
alter table public.stories add constraint capital_exact_in_range check (
  capital_exact is null
  or (capital_range = 'zero' and capital_exact = 0)
  or (capital_range = 'under_10k' and capital_exact > 0 and capital_exact < 10000)
  or (capital_range = '10k_50k' and capital_exact >= 10000 and capital_exact < 50000)
  or (capital_range = '50k_200k' and capital_exact >= 50000 and capital_exact < 200000)
  or (capital_range = '200k_1m' and capital_exact >= 200000 and capital_exact < 1000000)
  or (capital_range = '1m_plus' and capital_exact >= 1000000)
);

-- Sample data: cover the "running, not profitable yet" outcome too.
update public.stories
set outcome = 'not_profitable_yet',
    months_to_profit = null,
    profit_not_yet = true,
    stage_now = 'كورسات online، والدخل لسه بيغطي المصاريف بالعافية'
where is_sample and business_name = 'كود بالمصري';
