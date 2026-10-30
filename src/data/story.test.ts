import { describe, expect, it } from 'vitest'
import { founderName, governorateLabel, industryLabel } from './story'

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
