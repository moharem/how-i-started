import { describe, expect, it } from 'vitest'
import { dictionaries } from './dictionary'

describe('months in Arabic', () => {
  const months = dictionaries.ar.months
  it('says "less than a month" for 0', () => expect(months(0)).toBe('أقل من شهر'))
  it('uses the singular for 1', () => expect(months(1)).toBe('شهر'))
  it('uses the dual for 2', () => expect(months(2)).toBe('شهرين'))
  it('uses the plural for 3 to 10', () => {
    expect(months(3)).toBe('3 شهور')
    expect(months(10)).toBe('10 شهور')
  })
  it('uses the singular noun from 11 up', () => expect(months(11)).toBe('11 شهر'))
})

describe('months in English', () => {
  const months = dictionaries.en.months
  it('says "less than a month" for 0', () => expect(months(0)).toBe('less than a month'))
  it('uses the singular for 1', () => expect(months(1)).toBe('1 month'))
  it('uses the plural above 1', () => expect(months(5)).toBe('5 months'))
})
