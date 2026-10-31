import { Fragment } from 'react'
import type { TextPart } from '../data/story'
import { dirOf, type Lang } from '../i18n/lang'

/**
 * Text typed by the founder is in the story's language, which can differ from the
 * interface language. <bdi> with an explicit dir keeps it in the right order
 * (never dir="auto": see "Mixed text" in AGENTS.md). Translated labels are in the
 * interface language and must not be wrapped.
 */
export function StoryText({ lang, children }: { lang: Lang; children: string }) {
  return (
    <bdi dir={dirOf(lang)} lang={lang}>
      {children}
    </bdi>
  )
}

/** Shows text pieces joined by a separator, wrapping only the founder's own words. */
export function TextParts({
  parts,
  storyLang,
  separator,
}: {
  parts: TextPart[]
  storyLang: Lang
  separator: string
}) {
  return parts.map((part, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: short fixed list that never reorders
    <Fragment key={i}>
      {i > 0 && separator}
      {part.fromStory ? <StoryText lang={storyLang}>{part.value}</StoryText> : part.value}
    </Fragment>
  ))
}
