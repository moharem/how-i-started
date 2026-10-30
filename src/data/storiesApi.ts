import { supabase } from '../lib/supabase'
import type { Story } from './story'

/** Published stories, newest first (by publish date). The database only returns published rows. */
export async function fetchPublishedStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data as Story[]
}
