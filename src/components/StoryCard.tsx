import { Link } from 'react-router'
import { CAPITAL_RANGES } from '../data/options'
import { industryPart, locationParts, type Story } from '../data/story'
import { useLang } from '../i18n/LangContext'
import { Fact } from './Fact'
import { StoryHeader } from './StoryHeader'
import { TextParts } from './StoryText'

export function StoryCard({ story }: { story: Story }) {
  const { lang: uiLang, t } = useLang()
  const location = locationParts(story, uiLang)

  return (
    <Link
      to={`/${uiLang}/story/${story.id}`}
      className="block rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      <StoryHeader story={story} size="card" />
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
        <Fact label={t.startedWith}>{CAPITAL_RANGES[story.capital_range][uiLang]}</Fact>
        <Fact label={t.firstRevenue}>{t.months(story.months_to_revenue)}</Fact>
      </dl>
    </Link>
  )
}
