import { useEffect } from 'react'
import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router'
import { dictionaries } from './i18n/dictionary'
import { LangContext } from './i18n/LangContext'
import { detectLanguage, dirOf, isLang, saveLang, switchLangInPath } from './i18n/lang'

export function Layout() {
  const { lang } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (!isLang(lang)) return
    document.documentElement.lang = lang
    document.documentElement.dir = dirOf(lang)
  }, [lang])

  // Unknown prefix like "/fr/..." → send to the detected language's home.
  if (!isLang(lang)) return <Navigate to={`/${detectLanguage()}`} replace />

  const t = dictionaries[lang]
  const other = lang === 'ar' ? 'en' : 'ar'

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="mx-auto min-h-dvh max-w-2xl px-4">
        <header className="flex items-center justify-between py-4">
          <Link to={`/${lang}`} className="text-xl font-bold text-brand">
            {t.appName}
          </Link>
          <Link
            to={switchLangInPath(location.pathname, other)}
            onClick={() => saveLang(other)}
            lang={other}
            className="rounded-full border border-brand/30 px-3 py-1 text-sm text-brand"
          >
            {t.switchTo}
          </Link>
        </header>
        <main className="pb-12">
          <Outlet />
        </main>
      </div>
    </LangContext.Provider>
  )
}
