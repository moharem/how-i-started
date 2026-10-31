import { founderName, type Story } from '../data/story'
import { useLang } from '../i18n/LangContext'
import { StoryText } from './StoryText'

/**
 * The sample label, business name and founder name (or "Anonymous"). The home card
 * uses the small size with an h2; the story page uses the large size with an h1.
 */
export function StoryHeader({
  story,
  size,
}: {
  story: Pick<Story, 'is_sample' | 'lang' | 'business_name' | 'founder_name'>
  size: 'card' | 'page'
}) {
  const { t } = useLang()
  const founder = founderName(story)
  const Heading = size === 'page' ? 'h1' : 'h2'

  return (
    <>
      {story.is_sample && (
        <span className="mb-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-ink/70">
          {t.sample}
        </span>
      )}
      <Heading className={`font-bold text-brand ${size === 'page' ? 'text-2xl' : 'text-lg'}`}>
        <StoryText lang={story.lang}>{story.business_name}</StoryText>
      </Heading>
      <p className={size === 'page' ? 'text-ink/70' : 'text-sm text-ink/70'}>
        {founder ? <StoryText lang={story.lang}>{founder}</StoryText> : t.anonymous}
      </p>
    </>
  )
}
