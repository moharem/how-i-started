import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { StoryText } from '../../components/StoryText'
import {
  deleteStory,
  fetchAllStories,
  setSamplesPublished,
  setStoryStatus,
} from '../../data/adminApi'
import { STORY_STATUSES, type StoryStatus } from '../../data/options'
import { founderName, type Story } from '../../data/story'
import { useLang } from '../../i18n/LangContext'
import { DbErrorMessage } from './DbErrorMessage'
import { groupByStatus, sampleToggle } from './storyGroups'

type State = { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; stories: Story[] }

export function AdminStories() {
  const { t } = useLang()
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [tab, setTab] = useState<StoryStatus>('pending')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<unknown>(null)

  const load = useCallback(() => {
    fetchAllStories()
      .then((stories) => setState({ kind: 'ready', stories }))
      .catch(() => setState({ kind: 'error' }))
  }, [])
  useEffect(load, [load])

  /** Runs one change, then reloads the list so it shows what the database now holds. */
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true)
    setActionError(null)
    try {
      await action()
    } catch (error) {
      setActionError(error)
    }
    load()
    setBusy(false)
  }

  if (state.kind === 'loading') return <p className="text-ink/60">{t.admin.loading}</p>
  if (state.kind === 'error') {
    return (
      <div>
        <p>{t.admin.loadError}</p>
        <button type="button" onClick={load} className="mt-3 text-brand underline">
          {t.retry}
        </button>
      </div>
    )
  }

  const groups = groupByStatus(state.stories)
  const samples = sampleToggle(state.stories)

  return (
    <div>
      {samples && (
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => setSamplesPublished(samples === 'show'))}
          className="mb-4 rounded-full border border-brand/30 px-4 py-1.5 text-sm text-brand disabled:opacity-60"
        >
          {samples === 'hide' ? t.admin.hideSamples : t.admin.showSamples}
        </button>
      )}

      <div role="tablist" className="flex gap-1 border-b border-ink/10">
        {STORY_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={tab === status}
            onClick={() => setTab(status)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${
              tab === status
                ? 'border-brand font-bold text-brand'
                : 'border-transparent text-ink/60'
            }`}
          >
            {t.admin.status[status]} ({groups[status].length})
          </button>
        ))}
      </div>

      {actionError !== null && (
        <div className="mt-3">
          <DbErrorMessage error={actionError} />
        </div>
      )}
      {busy && <p className="mt-3 text-sm text-ink/60">{t.admin.working}</p>}

      {groups[tab].length === 0 ? (
        <p className="mt-4 text-ink/60">{t.admin.noneHere}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {groups[tab].map((story) => (
            <li key={story.id}>
              <StoryRow story={story} busy={busy} run={run} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StoryRow({
  story,
  busy,
  run,
}: {
  story: Story
  busy: boolean
  run: (action: () => Promise<unknown>) => void
}) {
  const { lang, t } = useLang()
  const [confirming, setConfirming] = useState(false)
  const founder = founderName(story)
  const canDelete = story.status !== 'published'
  const button = 'rounded-full border px-3 py-1 text-sm disabled:opacity-60'

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-3">
      {story.is_sample && (
        <span className="mb-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-ink/70">
          {t.sample}
        </span>
      )}
      <p className="font-bold">
        <StoryText lang={story.lang}>{story.business_name}</StoryText>
      </p>
      <p className="text-sm text-ink/70">
        {founder ? <StoryText lang={story.lang}>{founder}</StoryText> : t.anonymous}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to={`/${lang}/admin/story/${story.id}`}
          className={`${button} border-brand/30 text-brand`}
        >
          {t.admin.edit}
        </Link>
        {story.status === 'published' && (
          <Link to={`/${lang}/story/${story.id}`} className={`${button} border-ink/20`}>
            {t.admin.view}
          </Link>
        )}
        {story.status === 'published' ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => setStoryStatus(story.id, 'unpublished'))}
            className={`${button} border-ink/20`}
          >
            {t.admin.unpublish}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => setStoryStatus(story.id, 'published'))}
            className={`${button} border-brand bg-brand text-white`}
          >
            {t.admin.publish}
          </button>
        )}
        {canDelete && !confirming && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming(true)}
            className={`${button} border-red-300 text-red-700`}
          >
            {t.admin.delete}
          </button>
        )}
      </div>

      {canDelete && confirming && (
        <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm">
          <p>{t.admin.confirmDelete}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => deleteStory(story.id))}
              className={`${button} border-red-700 bg-red-700 text-white`}
            >
              {t.admin.confirmDeleteYes}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={`${button} border-ink/20`}
            >
              {t.admin.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
