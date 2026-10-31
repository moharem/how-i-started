import type { Lang } from '../i18n/lang'
import {
  type CapitalRange,
  GOVERNORATES,
  type Governorate,
  INDUSTRIES,
  type Industry,
  type LocationType,
  type MoneySource,
  OUTSIDE_EGYPT,
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

/**
 * A piece of text to show next to other pieces. `fromStory` is true when the founder
 * typed it (it is in the story's language and needs the story's direction); false when
 * it is a translated label in the interface language.
 */
export type TextPart = { value: string; fromStory: boolean }

/** The industry: a translated label, or the founder's own words for "other". */
export function industryPart(
  story: Pick<Story, 'industry' | 'industry_other'>,
  uiLang: Lang,
): TextPart {
  const label = industryLabel(story, uiLang)
  return label
    ? { value: label, fromStory: false }
    : { value: story.industry_other ?? '', fromStory: true }
}

/**
 * Location pieces in reading order. Egypt: governorate, city. Abroad: country, city,
 * preceded by an "Outside Egypt" label when `withAbroadLabel` is set (the story page
 * says it; the short home card does not).
 */
export function locationParts(
  story: Pick<Story, 'location_type' | 'governorate' | 'country' | 'city'>,
  uiLang: Lang,
  { withAbroadLabel = false } = {},
): TextPart[] {
  const parts: TextPart[] = []
  const governorate = governorateLabel(story, uiLang)
  if (governorate) parts.push({ value: governorate, fromStory: false })
  if (story.location_type === 'abroad') {
    if (withAbroadLabel) parts.push({ value: OUTSIDE_EGYPT[uiLang], fromStory: false })
    const country = story.country?.trim()
    if (country) parts.push({ value: country, fromStory: true })
  }
  const city = story.city?.trim()
  if (city) parts.push({ value: city, fromStory: true })
  return parts
}

/**
 * How to show "months to first profit":
 * - months: the founder gave a number
 * - never: no number and the business closed
 * - not_yet: the founder said "not yet"
 * - unknown: nothing given (the row is hidden)
 */
export type ProfitStatus =
  | { kind: 'months'; months: number }
  | { kind: 'never' }
  | { kind: 'not_yet' }
  | { kind: 'unknown' }

export function profitStatus(
  story: Pick<Story, 'months_to_profit' | 'profit_not_yet' | 'outcome'>,
): ProfitStatus {
  if (story.months_to_profit !== null) return { kind: 'months', months: story.months_to_profit }
  // A closed business cannot still be on its way to a profit.
  if (story.outcome === 'closed') return { kind: 'never' }
  if (story.profit_not_yet) return { kind: 'not_yet' }
  return { kind: 'unknown' }
}

/** The five story questions, in the order they are asked. */
export const STORY_QUESTIONS = [
  'q_had',
  'q_first_spend',
  'q_hardest',
  'q_first_customer',
  'q_advice',
] as const
export type StoryQuestion = (typeof STORY_QUESTIONS)[number]

/** Questions the founder answered, in order, with surrounding blank space removed. */
export function answeredQuestions(
  story: Pick<Story, StoryQuestion>,
): { question: StoryQuestion; answer: string }[] {
  return STORY_QUESTIONS.flatMap((question) => {
    const answer = story[question]?.trim()
    return answer ? [{ question, answer }] : []
  })
}

/** An amount in Egyptian pounds with thousands separators, e.g. "35,000 EGP" or "35,000 جنيه". */
export function formatEgp(amount: number, uiLang: Lang): string {
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)
  return uiLang === 'ar' ? `${number} جنيه` : `${number} EGP`
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Story ids are UUIDs. Anything else in the URL cannot be a story. */
export function isStoryId(id: string | undefined): id is string {
  return id !== undefined && UUID.test(id)
}
