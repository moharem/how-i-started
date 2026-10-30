import type { Lang } from '../i18n/lang'
import {
  type CapitalRange,
  GOVERNORATES,
  type Governorate,
  INDUSTRIES,
  type Industry,
  type LocationType,
  type MoneySource,
  type Outcome,
  type StoryStatus,
  type WorkMode,
} from './options'

export type Story = {
  id: string
  status: StoryStatus
  is_sample: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  lang: Lang
  business_name: string
  founder_name: string | null
  industry: Industry
  industry_other: string | null
  location_type: LocationType
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

/** A translated option label, or null when the founder typed free text instead. */
export function industryLabel(story: Pick<Story, 'industry'>, uiLang: Lang): string | null {
  if (story.industry === 'other') return null
  return INDUSTRIES[story.industry][uiLang]
}

/** Translated governorate for Egypt stories; null for abroad (the country is free text). */
export function governorateLabel(story: Pick<Story, 'governorate'>, uiLang: Lang): string | null {
  return story.governorate ? GOVERNORATES[story.governorate][uiLang] : null
}

/** The founder's name, or null when empty (shown as "Anonymous"). */
export function founderName(story: Pick<Story, 'founder_name'>): string | null {
  const name = story.founder_name?.trim()
  return name ? name : null
}
