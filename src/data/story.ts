import type { Lang } from '../i18n/lang'
import { supabase } from '../lib/supabase'
import {
  CAPITAL_RANGES,
  type CapitalRange,
  GOVERNORATES,
  type Governorate,
  INDUSTRIES,
  type Industry,
  type MoneySource,
  type Outcome,
  type WorkMode,
} from './options'

export type Story = {
  id: string
  is_sample: boolean
  published_at: string | null
  lang: Lang
  business_name: string
  founder_name: string | null
  industry: Industry
  industry_other: string | null
  location_type: 'egypt' | 'abroad'
  governorate: Governorate | null
  city: string | null
  country: string | null
  year_started: number
  capital_range: CapitalRange
  capital_exact: number | null
  currency_note: string | null
  money_source: MoneySource
  work_mode: WorkMode
  kept_job: boolean | null
  team_size_start: number | null
  months_to_revenue: number
  months_to_profit: number | null
  profit_not_yet: boolean
  outcome: Outcome
  team_size_now: number | null
  stage_now: string | null
  q_had: string | null
  q_first_spend: string | null
  q_hardest: string | null
  q_first_customer: string | null
  q_advice: string | null
}

/** Published stories, newest first. The database only returns published rows. */
export async function fetchPublishedStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data as Story[]
}

export function industryLabel(story: Pick<Story, 'industry' | 'industry_other'>, ui: Lang) {
  if (story.industry === 'other' && story.industry_other) return story.industry_other
  return INDUSTRIES[story.industry][ui]
}

/** Governorate (translated) for Egypt, or the free-text country for abroad. */
export function regionLabel(
  story: Pick<Story, 'location_type' | 'governorate' | 'country'>,
  ui: Lang,
): string {
  if (story.location_type === 'egypt' && story.governorate) {
    return GOVERNORATES[story.governorate][ui]
  }
  return story.country ?? ''
}

export function capitalLabel(range: CapitalRange, ui: Lang): string {
  return CAPITAL_RANGES[range][ui]
}

/** "3 months", or the Egyptian Arabic form ("شهرين", "3 شهور", "11 شهر"). */
export function formatMonths(n: number, ui: Lang): string {
  if (ui === 'en') {
    if (n === 0) return 'less than a month'
    return n === 1 ? '1 month' : `${n} months`
  }
  if (n === 0) return 'أقل من شهر'
  if (n === 1) return 'شهر'
  if (n === 2) return 'شهرين'
  if (n <= 10) return `${n} شهور`
  return `${n} شهر`
}
