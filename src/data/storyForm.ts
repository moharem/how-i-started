// Story form logic shared by the admin form and (later) the founder form:
// the values the inputs hold, the checks that give friendly messages, and the
// conversion to database columns. The database checks the same rules again and
// stays the authority (see supabase/migrations).
import type { Lang } from '../i18n/lang'
import type {
  CapitalRange,
  Governorate,
  Industry,
  LocationType,
  MoneySource,
  Outcome,
  WorkMode,
} from './options'
import { STORY_QUESTIONS, type Story, type StoryQuestion } from './story'

/** The columns a story form fills in. Workflow columns (status, is_sample, dates) are not here. */
export type StoryInput = Omit<
  Story,
  'id' | 'status' | 'is_sample' | 'published_at' | 'created_at' | 'updated_at'
>

/** What the inputs hold while typing: text for every box, '' for "nothing picked yet". */
export type StoryFormValues = {
  lang: Lang | ''
  business_name: string
  founder_name: string
  industry: Industry | ''
  industry_other: string
  location_type: LocationType
  governorate: Governorate | ''
  city: string
  country: string
  year_started: string
  capital_range: CapitalRange | ''
  capital_exact: string
  currency_note: string
  money_source: MoneySource | ''
  work_mode: WorkMode | ''
  kept_job: '' | 'yes' | 'no'
  team_size_start: string
  months_to_revenue: string
  months_to_profit: string
  profit_not_yet: boolean
  outcome: Outcome | ''
  team_size_now: string
  stage_now: string
} & Record<StoryQuestion, string>

export function emptyStoryForm(): StoryFormValues {
  return {
    lang: '',
    business_name: '',
    founder_name: '',
    industry: '',
    industry_other: '',
    location_type: 'egypt',
    governorate: '',
    city: '',
    country: '',
    year_started: '',
    capital_range: '',
    capital_exact: '',
    currency_note: '',
    money_source: '',
    work_mode: '',
    kept_job: '',
    team_size_start: '',
    months_to_revenue: '',
    months_to_profit: '',
    profit_not_yet: false,
    outcome: '',
    team_size_now: '',
    stage_now: '',
    q_had: '',
    q_first_spend: '',
    q_hardest: '',
    q_first_customer: '',
    q_advice: '',
  }
}

const text = (value: string | null): string => value ?? ''
const num = (value: number | null): string => (value === null ? '' : String(value))

/** Fills the form from a saved story, for editing. */
export function storyToForm(story: StoryInput): StoryFormValues {
  return {
    lang: story.lang,
    business_name: story.business_name,
    founder_name: text(story.founder_name),
    industry: story.industry,
    industry_other: text(story.industry_other),
    location_type: story.location_type,
    governorate: story.governorate ?? '',
    city: text(story.city),
    country: text(story.country),
    year_started: String(story.year_started),
    capital_range: story.capital_range,
    capital_exact: num(story.capital_exact),
    currency_note: text(story.currency_note),
    money_source: story.money_source,
    work_mode: story.work_mode,
    kept_job: story.kept_job === null ? '' : story.kept_job ? 'yes' : 'no',
    team_size_start: num(story.team_size_start),
    months_to_revenue: String(story.months_to_revenue),
    months_to_profit: num(story.months_to_profit),
    profit_not_yet: story.profit_not_yet,
    outcome: story.outcome,
    team_size_now: num(story.team_size_now),
    stage_now: text(story.stage_now),
    q_had: text(story.q_had),
    q_first_spend: text(story.q_first_spend),
    q_hardest: text(story.q_hardest),
    q_first_customer: text(story.q_first_customer),
    q_advice: text(story.q_advice),
  }
}

/**
 * Turns typed digits into a number. Accepts Arabic-Indic digits (٣٥٠٠٠), which an
 * Arabic keyboard types, and thousands separators ("50,000"). Returns null for an
 * empty box and NaN for anything that is not a number.
 */
export function parseNumber(value: string): number | null {
  const western = value
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[,٬،\s]/g, '')
  if (western === '') return null
  return /^\d+(\.\d+)?$/.test(western) ? Number(western) : Number.NaN
}

/**
 * True when an exact amount fits the chosen range, with the same rule as the
 * database: ranges include their lower bound and exclude their upper bound.
 */
export function amountFitsRange(amount: number, range: CapitalRange): boolean {
  switch (range) {
    case 'zero':
      return amount === 0
    case 'under_10k':
      return amount > 0 && amount < 10_000
    case '10k_50k':
      return amount >= 10_000 && amount < 50_000
    case '50k_200k':
      return amount >= 50_000 && amount < 200_000
    case '200k_1m':
      return amount >= 200_000 && amount < 1_000_000
    case '1m_plus':
      return amount >= 1_000_000
  }
}

/** Why a field was refused. Each one has a message in the dictionary (`t.formErrors`). */
export type FormError =
  | 'required'
  | 'tooLong'
  | 'notWholeNumber'
  | 'notNumber'
  | 'outOfRange'
  | 'futureYear'
  | 'amountOutsideRange'
  | 'needOneAnswer'

export type FormErrors = Partial<Record<keyof StoryFormValues | 'answers', FormError>>

const MAX_LENGTH: Partial<Record<keyof StoryFormValues, number>> = {
  business_name: 120,
  founder_name: 120,
  industry_other: 80,
  city: 80,
  country: 80,
  currency_note: 80,
  stage_now: 200,
  q_had: 5000,
  q_first_spend: 5000,
  q_hardest: 5000,
  q_first_customer: 5000,
  q_advice: 5000,
}

/** Whole-number fields: [lowest, highest, required]. */
const WHOLE_NUMBERS: Partial<Record<keyof StoryFormValues, [number, number, boolean]>> = {
  team_size_start: [1, 10_000, false],
  months_to_revenue: [0, 600, true],
  months_to_profit: [0, 600, false],
  team_size_now: [0, 100_000, false],
}

/**
 * Checks the form the way the database will, so the person gets a friendly message
 * next to the field instead of a database error. Returns an empty object when valid.
 */
export function validateStoryForm(
  values: StoryFormValues,
  currentYear = new Date().getFullYear(),
): FormErrors {
  const errors: FormErrors = {}
  const blank = (key: keyof StoryFormValues) => String(values[key]).trim() === ''

  for (const key of [
    'lang',
    'business_name',
    'industry',
    'capital_range',
    'money_source',
    'work_mode',
    'outcome',
  ] as const) {
    if (blank(key)) errors[key] = 'required'
  }
  if (values.industry === 'other' && blank('industry_other')) errors.industry_other = 'required'
  if (values.location_type === 'egypt' && values.governorate === '') errors.governorate = 'required'
  if (values.location_type === 'abroad' && blank('country')) errors.country = 'required'

  for (const [key, max] of Object.entries(MAX_LENGTH) as [keyof StoryFormValues, number][]) {
    if (!errors[key] && String(values[key]).trim().length > max) errors[key] = 'tooLong'
  }

  const year = parseNumber(values.year_started)
  if (year === null) errors.year_started = 'required'
  else if (!Number.isInteger(year)) errors.year_started = 'notWholeNumber'
  else if (year > currentYear) errors.year_started = 'futureYear'
  else if (year < 1950) errors.year_started = 'outOfRange'

  for (const [key, [low, high, required]] of Object.entries(WHOLE_NUMBERS) as [
    keyof StoryFormValues,
    [number, number, boolean],
  ][]) {
    if (key === 'months_to_profit' && values.profit_not_yet) continue
    const n = parseNumber(String(values[key]))
    if (n === null) {
      if (required) errors[key] = 'required'
    } else if (!Number.isInteger(n)) errors[key] = 'notWholeNumber'
    else if (n < low || n > high) errors[key] = 'outOfRange'
  }

  const exact = parseNumber(values.capital_exact)
  if (exact !== null) {
    if (Number.isNaN(exact)) errors.capital_exact = 'notNumber'
    else if (values.capital_range !== '' && !amountFitsRange(exact, values.capital_range)) {
      errors.capital_exact = 'amountOutsideRange'
    }
  }

  if (STORY_QUESTIONS.every((q) => values[q].trim() === '')) errors.answers = 'needOneAnswer'

  return errors
}

/** Trimmed text, or null when empty. */
const orNull = (value: string): string | null => value.trim() || null
const numberOrNull = (value: string): number | null => parseNumber(value)

/**
 * Converts valid form values to database columns. Values that the current choices
 * make irrelevant are dropped: the "other" text when a listed industry is picked,
 * the country for Egypt and the governorate for abroad, and the profit months when
 * "not yet" is ticked. Call only after `validateStoryForm` found no errors.
 */
export function formToStory(values: StoryFormValues): StoryInput {
  const required = <T extends string>(value: T | ''): T => {
    if (value === '') throw new Error('formToStory called with a missing required value')
    return value
  }
  const egypt = values.location_type === 'egypt'
  return {
    lang: required(values.lang),
    business_name: values.business_name.trim(),
    founder_name: orNull(values.founder_name),
    industry: required(values.industry),
    industry_other: values.industry === 'other' ? orNull(values.industry_other) : null,
    location_type: values.location_type,
    governorate: egypt ? required(values.governorate) : null,
    city: orNull(values.city),
    country: egypt ? null : orNull(values.country),
    year_started: numberOrNull(values.year_started) ?? 0,
    capital_range: required(values.capital_range),
    capital_exact: numberOrNull(values.capital_exact),
    currency_note: orNull(values.currency_note),
    money_source: required(values.money_source),
    work_mode: required(values.work_mode),
    kept_job: values.kept_job === '' ? null : values.kept_job === 'yes',
    team_size_start: numberOrNull(values.team_size_start),
    months_to_revenue: numberOrNull(values.months_to_revenue) ?? 0,
    months_to_profit: values.profit_not_yet ? null : numberOrNull(values.months_to_profit),
    profit_not_yet: values.profit_not_yet,
    outcome: required(values.outcome),
    team_size_now: numberOrNull(values.team_size_now),
    stage_now: orNull(values.stage_now),
    q_had: orNull(values.q_had),
    q_first_spend: orNull(values.q_first_spend),
    q_hardest: orNull(values.q_hardest),
    q_first_customer: orNull(values.q_first_customer),
    q_advice: orNull(values.q_advice),
  }
}
