import { Link } from 'react-router'
import { useLang } from '../i18n/LangContext'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFound() {
  const { lang, t } = useLang()
  usePageTitle()
  return (
    <section className="py-8">
      <p>{t.notFound}</p>
      <Link to={`/${lang}`} className="mt-4 inline-block text-brand underline">
        {t.backHome}
      </Link>
    </section>
  )
}
