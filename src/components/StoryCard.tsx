import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { CAPITAL_RANGES } from '../data/options'
import { founderName, governorateLabel, industryLabel, type Story } from '../data/story'
import { useLang } from '../i18n/LangContext'
import { dirOf, type Lang } from '../i18n/lang'

/**
 * Text typed by the founder is in the story's language, which can differ from the
 * interface language. <bdi> with an explicit dir keeps it in the right order
 * (never dir="auto": see "Mixed text" in AGENTS.md). Translated labels are in the
 * interface language and must not be wrapped.
 */
function StoryText({ lang, children }: { lang: Lang; children: string }) {
  return (
    <bdi dir={dirOf(lang)} lang={lang}>
      {children}
    </bdi>
  )
}

export function StoryCard({ story }: { story: Story }) {
  const { lang: uiLang, t } = useLang()
  const text = (value: string) => <StoryText lang={story.lang}>{value}</StoryText>

  const founder = founderName(story)
  const industry = industryLabel(story, uiLang) ?? text(story.industry_other ?? '')

  // Governorate is a translated label; country and city are free text.
  const governorate = governorateLabel(story, uiLang)
  const locationParts: ReactNode[] = [
    governorate ?? (story.country ? text(story.country) : null),
    story.city ? text(story.city) : null,
  ].filter(Boolean)

  return (
    <Link
      to={`/${uiLang}/story/${story.id}`}
      className="block rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      {story.is_sample && (
        <span className="mb-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-ink/70">
          {t.sample}
        </span>
      )}
      <h2 className="text-lg font-bold text-brand">{text(story.business_name)}</h2>
      <p className="text-sm text-ink/70">{founder ? text(founder) : t.anonymous}</p>
      <p className="mt-2 text-sm text-ink/70">
        {industry}
        {locationParts.length > 0 && ' · '}
        {locationParts.map((part, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed two-item list
          <Fragment key={i}>
            {i > 0 && t.listSeparator}
            {part}
          </Fragment>
        ))}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-paper p-2">
          <dt className="text-ink/60">{t.startedWith}</dt>
          <dd className="font-semibold">{CAPITAL_RANGES[story.capital_range][uiLang]}</dd>
        </div>
        <div className="rounded-xl bg-paper p-2">
          <dt className="text-ink/60">{t.firstRevenue}</dt>
          <dd className="font-semibold">{t.months(story.months_to_revenue)}</dd>
        </div>
      </dl>
    </Link>
  )
}
