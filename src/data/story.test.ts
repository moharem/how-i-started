import { describe, expect, it } from 'vitest'
import { formatMonths, industryLabel, regionLabel } from './story'

describe('formatMonths', () => {
  it('uses Egyptian Arabic plural forms', () => {
    expect(formatMonths(0, 'ar')).toBe('أقل من شهر')
    expect(formatMonths(1, 'ar')).toBe('شهر')
    expect(formatMonths(2, 'ar')).toBe('شهرين')
    expect(formatMonths(3, 'ar')).toBe('3 شهور')
    expect(formatMonths(10, 'ar')).toBe('10 شهور')
    expect(formatMonths(11, 'ar')).toBe('11 شهر')
  })

  it('uses English singular and plural', () => {
    expect(formatMonths(0, 'en')).toBe('less than a month')
    expect(formatMonths(1, 'en')).toBe('1 month')
    expect(formatMonths(5, 'en')).toBe('5 months')
  })
})

describe('industryLabel', () => {
  it('shows the free text when the industry is "other"', () => {
    expect(industryLabel({ industry: 'other', industry_other: 'Car wash' }, 'ar')).toBe('Car wash')
  })

  it('translates listed industries', () => {
    expect(industryLabel({ industry: 'food', industry_other: null }, 'ar')).toBe('أكل ومشروبات')
    expect(industryLabel({ industry: 'food', industry_other: null }, 'en')).toBe('Food & drinks')
  })
})

describe('regionLabel', () => {
  it('translates Egyptian governorates', () => {
    const s = { location_type: 'egypt', governorate: 'aswan', country: null } as const
    expect(regionLabel(s, 'en')).toBe('Aswan')
    expect(regionLabel(s, 'ar')).toBe('أسوان')
  })

  it('shows the country for stories that started abroad', () => {
    const s = { location_type: 'abroad', governorate: null, country: 'Dubai, UAE' } as const
    expect(regionLabel(s, 'ar')).toBe('Dubai, UAE')
  })
})
