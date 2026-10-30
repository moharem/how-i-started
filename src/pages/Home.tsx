import { useCallback, useEffect, useState } from 'react'
import { StoryCard } from '../components/StoryCard'
import { fetchPublishedStories } from '../data/storiesApi'
import type { Story } from '../data/story'
import { useLang } from '../i18n/LangContext'

type State = { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; stories: Story[] }

export function Home() {
  const { t } = useLang()
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(() => {
    setState({ kind: 'loading' })
    fetchPublishedStories()
      .then((stories) => setState({ kind: 'ready', stories }))
      .catch(() => setState({ kind: 'error' }))
  }, [])

  useEffect(load, [load])

  return (
    <section className="py-4">
      <p className="text-lg leading-relaxed">{t.tagline}</p>

      <div className="mt-6">
        {state.kind === 'loading' && <p className="text-ink/60">{t.loading}</p>}
        {state.kind === 'error' && (
          <div>
            <p>{t.loadError}</p>
            <button type="button" onClick={load} className="mt-3 text-brand underline">
              {t.retry}
            </button>
          </div>
        )}
        {state.kind === 'ready' && state.stories.length === 0 && (
          <p className="text-ink/60">{t.comingSoon}</p>
        )}
        {state.kind === 'ready' && state.stories.length > 0 && (
          <ul className="space-y-3">
            {state.stories.map((story) => (
              <li key={story.id}>
                <StoryCard story={story} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
