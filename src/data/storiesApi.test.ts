import { beforeEach, describe, expect, it, vi } from 'vitest'

// Unit tests never talk to the real database: replace the Supabase client.
const maybeSingle = vi.fn()
const order = vi.fn()
type Filter = { eq: typeof eq; order: typeof order; maybeSingle: typeof maybeSingle }
const eq = vi.fn((_column: string, _value: string): Filter => ({ eq, order, maybeSingle }))
const select = vi.fn(() => ({ eq }))
const from = vi.fn((_table: string) => ({ select }))
vi.mock('../lib/supabase', () => ({ supabase: { from: (table: string) => from(table) } }))

const { fetchPublishedStories, fetchStory } = await import('./storiesApi')

const ID = '3f2b8c1e-9a4d-4e2f-8b7a-1c2d3e4f5a6b'

describe('fetchPublishedStories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks only for published stories, so the request may be cached offline', async () => {
    order.mockResolvedValue({ data: [], error: null })
    await fetchPublishedStories()
    expect(eq).toHaveBeenCalledWith('status', 'published')
  })
})

describe('fetchStory', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the story the database sends back', async () => {
    maybeSingle.mockResolvedValue({ data: { id: ID }, error: null })
    await expect(fetchStory(ID)).resolves.toEqual({ id: ID })
    expect(from).toHaveBeenCalledWith('stories')
    expect(eq).toHaveBeenCalledWith('id', ID)
  })

  it('asks only for a published story, even when an admin is logged in', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null })
    await fetchStory(ID)
    expect(eq).toHaveBeenCalledWith('status', 'published')
  })

  it('returns null when no published story has this id', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null })
    await expect(fetchStory(ID)).resolves.toBeNull()
  })

  it('returns null for an id that is not a UUID, without asking the database', async () => {
    await expect(fetchStory('not-a-story')).resolves.toBeNull()
    expect(from).not.toHaveBeenCalled()
  })

  it('throws when the database answers with an error', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: new Error('offline') })
    await expect(fetchStory(ID)).rejects.toThrow('offline')
  })
})
