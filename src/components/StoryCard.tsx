import { Link } from 'react-router'
import { CAPITAL_RANGES } from '../data/options'
import { founderName, industryPart, locationParts, type Story } from '../data/story'
import { useLang } from '../i18n/LangContext'
import { StoryText, TextParts } from './StoryText'

export function StoryCard({ story }: { story: Story }) {
  const { lang: uiLang, t } = useLang()
  const founder = founderName(story)
  const location = locationParts(story, uiLang)

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
      <h2 className="text-lg font-bold text-brand">
        <StoryText lang={story.lang}>{story.business_name}</StoryText>
      </h2>
      <p className="text-sm text-ink/70">
        {founder ? <StoryText lang={story.lang}>{founder}</StoryText> : t.anonymous}
      </p>
      <p className="mt-2 text-sm text-ink/70">
        <TextParts
          parts={[industryPart(story, uiLang)]}
          storyLang={story.lang}
          separator={t.listSeparator}
        />
        {location.length > 0 && ' · '}
        <TextParts parts={location} storyLang={story.lang} separator={t.listSeparator} />
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
