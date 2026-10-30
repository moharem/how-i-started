import { Link } from 'react-router'
import { capitalLabel, formatMonths, industryLabel, regionLabel, type Story } from '../data/story'
import { useLang } from '../i18n/LangContext'
import { dirOf } from '../i18n/lang'

/**
 * Text typed by the founder is in the story's language, which can differ from the
 * interface language. <bdi> with an explicit dir keeps it in the right order
 * (never dir="auto": see "Mixed text" in AGENTS.md).
 */
function StoryText({ story, children }: { story: Story; children: string }) {
  return (
    <bdi dir={dirOf(story.lang)} lang={story.lang}>
      {children}
    </bdi>
  )
}

export function StoryCard({ story }: { story: Story }) {
  const { lang, t } = useLang()
  const region = regionLabel(story, lang)

  return (
    <Link
      to={`/${lang}/story/${story.id}`}
      className="block rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      {story.is_sample && (
        <span className="mb-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-ink/70">
          {t.sample}
        </span>
      )}
      <h2 className="text-lg font-bold text-brand">
        <StoryText story={story}>{story.business_name}</StoryText>
      </h2>
      <p className="text-sm text-ink/70">
        {story.founder_name ? (
          <StoryText story={story}>{story.founder_name}</StoryText>
        ) : (
          t.anonymous
        )}
      </p>
      <p className="mt-2 text-sm text-ink/70">
        {industryLabel(story, lang)}
        {region && (
          <>
            {' · '}
            <StoryText story={story}>{region}</StoryText>
          </>
        )}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-paper p-2">
          <dt className="text-ink/60">{t.startedWith}</dt>
          <dd className="font-semibold">{capitalLabel(story.capital_range, lang)}</dd>
        </div>
        <div className="rounded-xl bg-paper p-2">
          <dt className="text-ink/60">{t.firstRevenue}</dt>
          <dd className="font-semibold">{formatMonths(story.months_to_revenue, lang)}</dd>
        </div>
      </dl>
    </Link>
  )
}
