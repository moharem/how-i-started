import { useLang } from '../i18n/LangContext'

export function Home() {
  const { t } = useLang()
  return (
    <section className="py-8">
      <p className="text-lg leading-relaxed">{t.tagline}</p>
      <p className="mt-6 text-ink/60">{t.comingSoon}</p>
    </section>
  )
}
