import { supabase } from '../lib/supabase'
import { isStoryId, type Story } from './story'

// Public reads always filter on status=eq.published, even though the database only
// returns published rows to readers anyway. A logged-in admin sees every row, and the
// service worker caches only requests with this filter (src/lib/storiesCache.ts).

/** Published stories, newest first (by publish date). */
export async function fetchPublishedStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data as Story[]
}

/**
 * One published story, or null when there is none with this id. Unpublished stories
 * also come back as null, even for a logged-in admin.
 */
export async function fetchStory(id: string): Promise<Story | null> {
  // A malformed id would make the database answer with an error, not "no rows".
  if (!isStoryId(id)) return null
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'published')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Story | null
}
