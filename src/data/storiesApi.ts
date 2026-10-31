import { supabase } from '../lib/supabase'
import { isStoryId, type Story } from './story'

/** Published stories, newest first (by publish date). The database only returns published rows. */
export async function fetchPublishedStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data as Story[]
}

/**
 * One published story, or null when there is none with this id. Unpublished stories
 * also come back as null, because the database hides them from readers.
 */
export async function fetchStory(id: string): Promise<Story | null> {
  // A malformed id would make the database answer with an error, not "no rows".
  if (!isStoryId(id)) return null
  const { data, error } = await supabase.from('stories').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Story | null
}
