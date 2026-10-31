import { describe, expect, it } from 'vitest'
import {
  amountFitsRange,
  emptyStoryForm,
  formToStory,
  parseNumber,
  type StoryFormValues,
  storyToForm,
  validateStoryForm,
} from './storyForm'

const YEAR = 2026

/** A form that passes every check. Tests change one thing at a time. */
function validForm(changes: Partial<StoryFormValues> = {}): StoryFormValues {
  return {
    ...emptyStoryForm(),
    lang: 'ar',
    business_name: 'بيتزا الحتة',
    industry: 'food',
    governorate: 'alexandria',
    year_started: '2019',
    capital_range: '10k_50k',
    money_source: 'savings',
    work_mode: 'side',
    months_to_revenue: '1',
    outcome: 'profitable',
    q_had: 'Oven مستعمل',
    ...changes,
  }
}

describe('parseNumber', () => {
  it('returns null for an empty box', () => {
    expect(parseNumber('  ')).toBeNull()
  })

  it('reads Arabic-Indic digits', () => {
    expect(parseNumber('٣٥٠٠٠')).toBe(35000)
  })

  it('ignores thousands separators', () => {
    expect(parseNumber('50,000')).toBe(50000)
    expect(parseNumber('٥٠٬٠٠٠')).toBe(50000)
  })

  it('returns NaN for text that is not a number', () => {
    expect(parseNumber('ten')).toBeNaN()
    expect(parseNumber('-5')).toBeNaN()
  })
})

describe('amountFitsRange', () => {
  it('includes the lower bound and excludes the upper bound', () => {
    expect(amountFitsRange(10_000, '10k_50k')).toBe(true)
    expect(amountFitsRange(50_000, '10k_50k')).toBe(false)
  })

  it('only allows 0 for "no money"', () => {
    expect(amountFitsRange(0, 'zero')).toBe(true)
    expect(amountFitsRange(1, 'zero')).toBe(false)
  })

  it('does not allow 0 for "under 10k"', () => {
    expect(amountFitsRange(0, 'under_10k')).toBe(false)
  })
})

describe('validateStoryForm', () => {
  it('accepts a complete form', () => {
    expect(validateStoryForm(validForm(), YEAR)).toEqual({})
  })

  it('requires the story language', () => {
    expect(validateStoryForm(validForm({ lang: '' }), YEAR).lang).toBe('required')
  })

  it('treats a business name of only spaces as missing', () => {
    expect(validateStoryForm(validForm({ business_name: '   ' }), YEAR).business_name).toBe(
      'required',
    )
  })

  it('requires the industry text when "other" is picked', () => {
    const errors = validateStoryForm(validForm({ industry: 'other', industry_other: ' ' }), YEAR)
    expect(errors.industry_other).toBe('required')
  })

  it('requires a governorate for Egypt', () => {
    expect(validateStoryForm(validForm({ governorate: '' }), YEAR).governorate).toBe('required')
  })

  it('requires a country, not a governorate, for abroad', () => {
    const errors = validateStoryForm(
      validForm({ location_type: 'abroad', governorate: '', country: '' }),
      YEAR,
    )
    expect(errors).toEqual({ country: 'required' })
  })

  it('rejects a start year in the future', () => {
    expect(validateStoryForm(validForm({ year_started: '2027' }), YEAR).year_started).toBe(
      'futureYear',
    )
  })

  it('accepts the current year', () => {
    expect(
      validateStoryForm(validForm({ year_started: '2026' }), YEAR).year_started,
    ).toBeUndefined()
  })

  it('rejects a start year before 1950', () => {
    expect(validateStoryForm(validForm({ year_started: '1900' }), YEAR).year_started).toBe(
      'outOfRange',
    )
  })

  it('requires months to first revenue', () => {
    expect(validateStoryForm(validForm({ months_to_revenue: '' }), YEAR).months_to_revenue).toBe(
      'required',
    )
  })

  it('rejects fractions of a month', () => {
    expect(validateStoryForm(validForm({ months_to_revenue: '1.5' }), YEAR).months_to_revenue).toBe(
      'notWholeNumber',
    )
  })

  it('rejects a team of 0 at the start', () => {
    expect(validateStoryForm(validForm({ team_size_start: '0' }), YEAR).team_size_start).toBe(
      'outOfRange',
    )
  })

  it('rejects an exact amount outside the chosen range', () => {
    expect(validateStoryForm(validForm({ capital_exact: '5,000' }), YEAR).capital_exact).toBe(
      'amountOutsideRange',
    )
  })

  it('ignores the profit months when "not yet" is ticked', () => {
    const form = validForm({ profit_not_yet: true, months_to_profit: 'abc' })
    expect(validateStoryForm(form, YEAR).months_to_profit).toBeUndefined()
  })

  it('needs at least one answered question', () => {
    expect(validateStoryForm(validForm({ q_had: '  ' }), YEAR).answers).toBe('needOneAnswer')
  })

  it('rejects text longer than the database allows', () => {
    expect(
      validateStoryForm(validForm({ business_name: 'x'.repeat(121) }), YEAR).business_name,
    ).toBe('tooLong')
  })
})

describe('formToStory', () => {
  it('trims text and stores empty optional boxes as null', () => {
    const story = formToStory(validForm({ business_name: '  Green Box ', founder_name: '  ' }))
    expect(story.business_name).toBe('Green Box')
    expect(story.founder_name).toBeNull()
  })

  it('converts number boxes to numbers', () => {
    const story = formToStory(validForm({ capital_exact: '٣٥,٠٠٠', months_to_revenue: '3' }))
    expect(story.capital_exact).toBe(35000)
    expect(story.months_to_revenue).toBe(3)
  })

  it('drops the "other" text when a listed industry is picked', () => {
    expect(formToStory(validForm({ industry_other: 'Pet care' })).industry_other).toBeNull()
  })

  it('drops a leftover country for Egypt', () => {
    expect(formToStory(validForm({ country: 'UAE' })).country).toBeNull()
  })

  it('drops a leftover governorate for abroad', () => {
    const story = formToStory(validForm({ location_type: 'abroad', country: 'UAE' }))
    expect(story.governorate).toBeNull()
    expect(story.country).toBe('UAE')
  })

  it('drops the profit months when "not yet" is ticked', () => {
    const story = formToStory(validForm({ months_to_profit: '4', profit_not_yet: true }))
    expect(story.months_to_profit).toBeNull()
    expect(story.profit_not_yet).toBe(true)
  })

  it('maps "kept their job" to true, false or unknown', () => {
    expect(formToStory(validForm({ kept_job: 'yes' })).kept_job).toBe(true)
    expect(formToStory(validForm({ kept_job: 'no' })).kept_job).toBe(false)
    expect(formToStory(validForm({ kept_job: '' })).kept_job).toBeNull()
  })

  it('keeps line breaks inside answers', () => {
    expect(formToStory(validForm({ q_had: ' one\ntwo ' })).q_had).toBe('one\ntwo')
  })
})

describe('storyToForm', () => {
  it('gives back the same story after a round trip through the form', () => {
    const story = formToStory(
      validForm({ founder_name: 'Mona', kept_job: 'no', capital_exact: '35000', city: 'سيدي بشر' }),
    )
    expect(formToStory(storyToForm(story))).toEqual(story)
  })
})
