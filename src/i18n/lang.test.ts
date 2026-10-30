import { describe, expect, it } from 'vitest'
import { pickLanguage, switchLangInPath } from './lang'

describe('pickLanguage', () => {
  it('uses the saved choice first', () => {
    expect(pickLanguage('en', ['ar-EG'])).toBe('en')
    expect(pickLanguage('ar', ['en-US'])).toBe('ar')
  })

  it('falls back to the device language', () => {
    expect(pickLanguage(null, ['ar-EG', 'en'])).toBe('ar')
    expect(pickLanguage(null, ['AR'])).toBe('ar')
  })

  it('uses English for any non-Arabic device', () => {
    expect(pickLanguage(null, ['en-GB'])).toBe('en')
    expect(pickLanguage(null, ['fr-FR', 'ar'])).toBe('en')
    expect(pickLanguage(null, [])).toBe('en')
  })

  it('ignores invalid saved values', () => {
    expect(pickLanguage('de', ['ar-EG'])).toBe('ar')
  })
})

describe('switchLangInPath', () => {
  it('swaps the language prefix', () => {
    expect(switchLangInPath('/ar/story/12', 'en')).toBe('/en/story/12')
    expect(switchLangInPath('/en', 'ar')).toBe('/ar')
  })

  it('does not touch words that only start with ar/en', () => {
    expect(switchLangInPath('/ar/arts', 'en')).toBe('/en/arts')
  })
})
