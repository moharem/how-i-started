import type { StoryStatus } from '../../data/options'
import type { Story } from '../../data/story'

/** Stories split by status, keeping their order inside each group. */
export function groupByStatus<T extends Pick<Story, 'status'>>(
  stories: T[],
): Record<StoryStatus, T[]> {
  const groups: Record<StoryStatus, T[]> = { pending: [], published: [], unpublished: [] }
  for (const story of stories) groups[story.status].push(story)
  return groups
}

/**
 * Which sample action to offer: "hide" while any sample is published, "show" when
 * samples exist but are all hidden, and nothing when there are no samples to change.
 */
export function sampleToggle(
  stories: Pick<Story, 'status' | 'is_sample'>[],
): 'hide' | 'show' | null {
  const samples = stories.filter((s) => s.is_sample)
  if (samples.some((s) => s.status === 'published')) return 'hide'
  if (samples.some((s) => s.status === 'unpublished')) return 'show'
  return null
}
