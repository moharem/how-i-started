import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Fact } from '../components/Fact'
import { StoryHeader } from '../components/StoryHeader'
import { StoryText, TextParts } from '../components/StoryText'
import { CAPITAL_RANGES, MONEY_SOURCES, OUTCOMES, WORK_MODES } from '../data/options'
import { fetchStory } from '../data/storiesApi'
import {
  answeredQuestions,
  formatAmount,
  industryPart,
  locationParts,
  type ProfitStatus,
  profitStatus,
  type Story,
} from '../data/story'
import type { Dictionary } from '../i18n/dictionary'
import { useLang } from '../i18n/LangContext'
import { dirOf } from '../i18n/lang'
import { usePageTitle } from '../lib/usePageTitle'

type State =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'missing' }
  | { kind: 'ready'; story: Story }

export function StoryPage() {
  const { id = '' } = useParams()
  const { lang, t } = useLang()
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(() => {
    setState({ kind: 'loading' })
    fetchStory(id)
      .then((story) => setState(story ? { kind: 'ready', story } : { kind: 'missing' }))
      .catch(() => setState({ kind: 'error' }))
  }, [id])

  useEffect(load, [load])
  usePageTitle(state.kind === 'ready' ? state.story.business_name : undefined)

  return (
    <article className="py-4">
      <Link to={`/${lang}`} className="text-sm text-brand underline">
        {t.allStories}
      </Link>

      <div className="mt-4">
        {state.kind === 'loading' && <p className="text-ink/60">{t.loadingStory}</p>}
        {state.kind === 'error' && (
          <div>
            <p>{t.storyLoadError}</p>
            <button type="button" onClick={load} className="mt-3 text-brand underline">
              {t.retry}
            </button>
          </div>
        )}
        {state.kind === 'missing' && <p>{t.storyNotFound}</p>}
        {state.kind === 'ready' && <StoryView story={state.story} />}
      </div>
    </article>
  )
}

function StoryView({ story }: { story: Story }) {
  const { t } = useLang()

  return (
    <>
      <StoryHeader story={story} size="page" />

      <StartingPoint story={story} />

      <div className="mt-8 space-y-6">
        {answeredQuestions(story).map(({ question, answer }) => (
          <section key={question}>
            <h2 className="font-bold text-brand">{t.questions[question]}</h2>
            {/* The answer keeps the story's direction even inside the other interface
                language, and keeps the founder's line breaks. */}
            <p
              dir={dirOf(story.lang)}
              lang={story.lang}
              className="mt-2 whitespace-pre-line leading-relaxed"
            >
              {answer}
            </p>
          </section>
        ))}
      </div>
    </>
  )
}

function profitText(status: ProfitStatus, t: Dictionary): string | null {
  switch (status.kind) {
    case 'months':
      return t.months(status.months)
    case 'not_yet':
      return t.profitNotYet
    case 'never':
      return t.profitNever
    case 'unknown':
      return null
  }
}

/** The summary card with the key numbers. */
function StartingPoint({ story }: { story: Story }) {
  const { lang: uiLang, t } = useLang()
  const profit = profitText(profitStatus(story), t)
  const currencyNote = story.currency_note?.trim()
  const stage = story.stage_now?.trim()
  const showExact = story.capital_exact !== null && story.capital_range !== 'zero'
  const hasToday = story.team_size_now !== null || Boolean(stage)

  return (
    <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-brand">{t.startingPoint}</h2>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <Fact label={t.startedWith} wide>
          {CAPITAL_RANGES[story.capital_range][uiLang]}
          {showExact && (
            <span className="block font-normal text-ink/70">
              {t.egp(formatAmount(story.capital_exact ?? 0))}
            </span>
          )}
          {currencyNote && (
            <span className="block font-normal text-ink/70">
              <StoryText lang={story.lang}>{currencyNote}</StoryText>
            </span>
          )}
        </Fact>
        <Fact label={t.firstRevenue} wide={!profit}>
          {t.months(story.months_to_revenue)}
        </Fact>
        {profit && <Fact label={t.firstProfit}>{profit}</Fact>}
        <Fact label={t.moneySource}>{MONEY_SOURCES[story.money_source][uiLang]}</Fact>
        <Fact label={t.yearStarted}>{story.year_started}</Fact>
        <Fact label={t.workMode}>{WORK_MODES[story.work_mode][uiLang]}</Fact>
        {story.kept_job !== null && <Fact label={t.keptJob}>{story.kept_job ? t.yes : t.no}</Fact>}
        {story.team_size_start !== null && (
          <Fact label={t.teamAtStart}>{t.people(story.team_size_start)}</Fact>
        )}
        <Fact label={t.industry}>
          <TextParts
            parts={[industryPart(story, uiLang)]}
            storyLang={story.lang}
            separator={t.listSeparator}
          />
        </Fact>
        <Fact label={t.location} wide>
          <TextParts
            parts={locationParts(story, uiLang, { abroadLabel: t.outsideEgypt })}
            storyLang={story.lang}
            separator={t.listSeparator}
          />
        </Fact>
        <Fact label={t.outcome} wide>
          {OUTCOMES[story.outcome][uiLang]}
        </Fact>
      </dl>

      {hasToday && (
        <>
          <h3 className="mt-4 font-bold text-brand">{t.today}</h3>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {story.team_size_now !== null && (
              <Fact label={t.teamNow} wide={!stage}>
                {t.people(story.team_size_now)}
              </Fact>
            )}
            {stage && (
              <Fact label={t.stageNow} wide>
                <StoryText lang={story.lang}>{stage}</StoryText>
              </Fact>
            )}
          </dl>
        </>
      )}
    </section>
  )
}
