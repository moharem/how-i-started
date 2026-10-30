import { describe, expect, it } from 'vitest'
import { formatMonths, founderName, governorateLabel, industryLabel } from './story'

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
