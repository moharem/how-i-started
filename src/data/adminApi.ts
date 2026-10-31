// Admin reads and writes. The database decides what is allowed (Row Level Security
// and public.is_admin()); these calls only ask. None of these requests filter on
// status=eq.published, so the service worker never caches them (see storiesCache.ts).
import { supabase } from '../lib/supabase'
import type { StoryStatus } from './options'
import { isStoryId, type Story } from './story'
import type { StoryInput } from './storyForm'

/** Admin-only story columns, set outside the shared story form. */
export type AdminFields = { status: StoryStatus; is_sample: boolean }

/** True when the logged-in user is in public.admins. */
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) throw error
  return data === true
}

/** Every story the admin can see (all statuses), newest first. */
export async function fetchAllStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Story[]
}

/** One story in any status, or null when there is none with this id. */
export async function fetchAnyStory(id: string): Promise<Story | null> {
  if (!isStoryId(id)) return null
  const { data, error } = await supabase.from('stories').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Story | null
}

/** Saves a new story and returns its id. */
export async function createStory(story: StoryInput, admin: AdminFields): Promise<string> {
  const { data, error } = await supabase
    .from('stories')
    .insert({ ...story, ...admin })
    .select('id')
    .single()
  if (error) throw error
  return (data as { id: string }).id
}

/**
 * Changes an existing story. `.single()` turns "no row changed" (for example when
 * the database refused it) into an error instead of a silent success.
 */
export async function updateStory(
  id: string,
  changes: Partial<StoryInput & AdminFields>,
): Promise<void> {
  const { error } = await supabase
    .from('stories')
    .update(changes)
    .eq('id', id)
    .select('id')
    .single()
  if (error) throw error
}

/**
 * Publishes or unpublishes a story. The database sets the publish date on the first
 * publish only, so unpublishing and publishing again keeps the story's place.
 */
export function setStoryStatus(id: string, status: 'published' | 'unpublished'): Promise<void> {
  return updateStory(id, { status })
}

/**
 * Hides every published sample story (publish = false) or shows every hidden one
 * again (publish = true), in one database update. Returns how many changed.
 */
export async function setSamplesPublished(publish: boolean): Promise<number> {
  const { data, error } = await supabase
    .from('stories')
    .update({ status: publish ? 'published' : 'unpublished' })
    .eq('is_sample', true)
    .eq('status', publish ? 'unpublished' : 'published')
    .select('id')
  if (error) throw error
  return (data ?? []).length
}

/**
 * Deletes a pending or unpublished story for good. A published story is never
 * deleted (the database refuses it too), and that refusal is reported as an error.
 */
export async function deleteStory(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id)
    .in('status', ['pending', 'unpublished'])
    .select('id')
  if (error) throw error
  if ((data ?? []).length === 0) {
    // Same code PostgREST uses when a row the request needs is not there.
    throw Object.assign(new Error('No story was deleted.'), { code: 'PGRST116' })
  }
}
