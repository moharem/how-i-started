import { describe, expect, it } from 'vitest'
import {
  answeredQuestions,
  formatEgp,
  founderName,
  governorateLabel,
  industryLabel,
  industryPart,
  isStoryId,
  locationParts,
  profitStatus,
} from './story'

describe('industryLabel', () => {
  it('returns null for "other", so the free text is shown instead', () => {
    expect(industryLabel({ industry: 'other' }, 'ar')).toBeNull()
  })

  it('translates listed industries', () => {
    expect(industryLabel({ industry: 'food' }, 'ar')).toBe('أكل ومشروبات')
    expect(industryLabel({ industry: 'food' }, 'en')).toBe('Food & drinks')
  })
})

describe('governorateLabel', () => {
  it('translates Egyptian governorates', () => {
    expect(governorateLabel({ governorate: 'aswan' }, 'en')).toBe('Aswan')
    expect(governorateLabel({ governorate: 'aswan' }, 'ar')).toBe('أسوان')
  })

  it('returns null for stories that started abroad', () => {
    expect(governorateLabel({ governorate: null }, 'ar')).toBeNull()
  })
})

describe('founderName', () => {
  it('treats empty or blank names as anonymous', () => {
    expect(founderName({ founder_name: null })).toBeNull()
    expect(founderName({ founder_name: '   ' })).toBeNull()
  })

  it('trims real names', () => {
    expect(founderName({ founder_name: ' Mona ' })).toBe('Mona')
  })
})

describe('industryPart', () => {
  it('uses the translated label for listed industries', () => {
    expect(industryPart({ industry: 'tech', industry_other: null }, 'en')).toEqual({
      value: 'Tech',
      fromStory: false,
    })
  })

  it('uses the founder\'s own words for "other"', () => {
    expect(industryPart({ industry: 'other', industry_other: 'Pet care' }, 'ar')).toEqual({
      value: 'Pet care',
      fromStory: true,
    })
  })
})

describe('locationParts', () => {
  const egypt = { location_type: 'egypt', governorate: 'alexandria', country: null } as const
  const abroad = { location_type: 'abroad', governorate: null, country: 'UAE' } as const

  it('gives the translated governorate, then the typed city, for Egypt', () => {
    expect(locationParts({ ...egypt, city: 'سيدي بشر' }, 'en')).toEqual([
      { value: 'Alexandria', fromStory: false },
      { value: 'سيدي بشر', fromStory: true },
    ])
  })

  it('leaves out an empty or blank city', () => {
    expect(locationParts({ ...egypt, city: '  ' }, 'ar')).toEqual([
      { value: 'الإسكندرية', fromStory: false },
    ])
  })

  it('gives the country and city for abroad, without a label by default', () => {
    expect(locationParts({ ...abroad, city: 'Dubai' }, 'en')).toEqual([
      { value: 'UAE', fromStory: true },
      { value: 'Dubai', fromStory: true },
    ])
  })

  it('starts with "Outside Egypt" for abroad when asked', () => {
    expect(locationParts({ ...abroad, city: null }, 'ar', { withAbroadLabel: true })).toEqual([
      { value: 'برّه مصر', fromStory: false },
      { value: 'UAE', fromStory: true },
    ])
  })

  it('never adds the abroad label to Egypt stories', () => {
    const parts = locationParts({ ...egypt, city: null }, 'en', { withAbroadLabel: true })
    expect(parts).toEqual([{ value: 'Alexandria', fromStory: false }])
  })
})

describe('profitStatus', () => {
  it('gives the months when the founder entered a number', () => {
    expect(
      profitStatus({ months_to_profit: 5, profit_not_yet: false, outcome: 'profitable' }),
    ).toEqual({ kind: 'months', months: 5 })
  })

  it('gives the months even for a closed business that was once profitable', () => {
    expect(profitStatus({ months_to_profit: 0, profit_not_yet: false, outcome: 'closed' })).toEqual(
      { kind: 'months', months: 0 },
    )
  })

  it('says "not yet" when the founder said so', () => {
    expect(
      profitStatus({ months_to_profit: null, profit_not_yet: true, outcome: 'not_profitable_yet' }),
    ).toEqual({ kind: 'not_yet' })
  })

  it('says "never" for a closed business with no profit month', () => {
    expect(
      profitStatus({ months_to_profit: null, profit_not_yet: false, outcome: 'closed' }),
    ).toEqual({ kind: 'never' })
  })

  it('says "never", not "not yet", once a business has closed', () => {
    expect(
      profitStatus({ months_to_profit: null, profit_not_yet: true, outcome: 'closed' }),
    ).toEqual({ kind: 'never' })
  })

  it('is unknown when nothing was given for a running business', () => {
    expect(
      profitStatus({ months_to_profit: null, profit_not_yet: false, outcome: 'pivoted' }),
    ).toEqual({ kind: 'unknown' })
  })
})

describe('answeredQuestions', () => {
  const none = {
    q_had: null,
    q_first_spend: null,
    q_hardest: null,
    q_first_customer: null,
    q_advice: null,
  }

  it('keeps only answered questions, in question order', () => {
    const answered = answeredQuestions({ ...none, q_advice: 'Start small', q_had: 'A laptop' })
    expect(answered.map((a) => a.question)).toEqual(['q_had', 'q_advice'])
  })

  it('skips blank answers and trims the rest but keeps inner line breaks', () => {
    expect(answeredQuestions({ ...none, q_hardest: '   ', q_first_spend: '  one\ntwo  ' })).toEqual(
      [{ question: 'q_first_spend', answer: 'one\ntwo' }],
    )
  })
})

describe('formatEgp', () => {
  it('adds thousands separators and the currency in the interface language', () => {
    expect(formatEgp(35000, 'en')).toBe('35,000 EGP')
    expect(formatEgp(35000, 'ar')).toBe('35,000 جنيه')
  })

  it('uses Western digits in Arabic, like the rest of the app', () => {
    expect(formatEgp(1200000, 'ar')).toBe('1,200,000 جنيه')
  })
})

describe('isStoryId', () => {
  it('accepts a UUID', () => {
    expect(isStoryId('3f2b8c1e-9a4d-4e2f-8b7a-1c2d3e4f5a6b')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isStoryId('123')).toBe(false)
    expect(isStoryId('')).toBe(false)
    expect(isStoryId(undefined)).toBe(false)
  })
})
