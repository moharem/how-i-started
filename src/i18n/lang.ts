export const LANGS = ['ar', 'en'] as const
export type Lang = (typeof LANGS)[number]

const STORAGE_KEY = 'lang'

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

export function dirOf(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr'
}

/**
 * Picks the language to open the site in, when the URL has none.
 * Order: the visitor's saved choice, then the device language
 * (Arabic if it starts with "ar", otherwise English).
 */
export function pickLanguage(saved: string | null, deviceLangs: readonly string[]): Lang {
  if (isLang(saved)) return saved
  const first = deviceLangs[0]?.toLowerCase() ?? ''
  return first.startsWith('ar') ? 'ar' : 'en'
}

// localStorage can throw (private mode, blocked storage), so failures are ignored.
export function readSavedLang(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore
  }
}

export function detectLanguage(): Lang {
  const device = navigator.languages?.length ? navigator.languages : [navigator.language]
  return pickLanguage(readSavedLang(), device)
}

/** Swaps the "/ar" or "/en" prefix of a path. */
export function switchLangInPath(pathname: string, to: Lang): string {
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, '')
  return `/${to}${rest}`
}
