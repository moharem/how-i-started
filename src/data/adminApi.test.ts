import { beforeEach, describe, expect, it, vi } from 'vitest'

// Unit tests never talk to the real database: replace the Supabase client with a
// query builder that records every call and answers with `result`.
type Result = { data: unknown; error: unknown }
let result: Result
let calls: [string, ...unknown[]][]

function builder(): Record<string, unknown> {
  const chain: Record<string, unknown> = {
    // Awaiting the query gives the prepared result.
    // biome-ignore lint/suspicious/noThenProperty: mimics the awaitable Supabase builder
    then: (resolve: (r: Result) => void) => resolve(result),
  }
  for (const name of [
    'select',
    'insert',
    'update',
    'delete',
    'eq',
    'in',
    'order',
    'single',
    'maybeSingle',
  ]) {
    chain[name] = (...args: unknown[]) => {
      calls.push([name, ...args])
      return chain
    }
  }
  return chain
}

const rpc = vi.fn()
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      calls.push(['from', table])
      return builder()
    },
    rpc: (name: string) => rpc(name),
  },
}))

const { checkIsAdmin, createStory, deleteStory, setSamplesPublished, setStoryStatus } =
  await import('./adminApi')

const ID = '3f2b8c1e-9a4d-4e2f-8b7a-1c2d3e4f5a6b'

beforeEach(() => {
  calls = []
  result = { data: null, error: null }
  rpc.mockReset()
})

describe('checkIsAdmin', () => {
  it('is true only when the database says true', async () => {
    rpc.mockResolvedValue({ data: true, error: null })
    await expect(checkIsAdmin()).resolves.toBe(true)
    expect(rpc).toHaveBeenCalledWith('is_admin')
  })

  it('is false for a logged-in user who is not an admin', async () => {
    rpc.mockResolvedValue({ data: false, error: null })
    await expect(checkIsAdmin()).resolves.toBe(false)
  })

  it('throws when the check itself fails', async () => {
    rpc.mockResolvedValue({ data: null, error: new Error('offline') })
    await expect(checkIsAdmin()).rejects.toThrow('offline')
  })
})

describe('setStoryStatus', () => {
  it('sends only the new status, never a publish date', async () => {
    result = { data: { id: ID }, error: null }
    await setStoryStatus(ID, 'published')
    expect(calls).toContainEqual(['update', { status: 'published' }])
    expect(calls).toContainEqual(['eq', 'id', ID])
  })
})

describe('setSamplesPublished', () => {
  it('hides only published sample stories', async () => {
    result = { data: [{ id: 'a' }, { id: 'b' }], error: null }
    await expect(setSamplesPublished(false)).resolves.toBe(2)
    expect(calls).toContainEqual(['update', { status: 'unpublished' }])
    expect(calls).toContainEqual(['eq', 'is_sample', true])
    expect(calls).toContainEqual(['eq', 'status', 'published'])
  })

  it('shows only hidden sample stories', async () => {
    result = { data: [], error: null }
    await setSamplesPublished(true)
    expect(calls).toContainEqual(['update', { status: 'published' }])
    expect(calls).toContainEqual(['eq', 'status', 'unpublished'])
  })
})

describe('deleteStory', () => {
  it('only targets pending or unpublished stories', async () => {
    result = { data: [{ id: ID }], error: null }
    await deleteStory(ID)
    expect(calls).toContainEqual(['in', 'status', ['pending', 'unpublished']])
  })

  it('throws when nothing was deleted', async () => {
    result = { data: [], error: null }
    await expect(deleteStory(ID)).rejects.toMatchObject({ code: 'PGRST116' })
  })
})

describe('createStory', () => {
  it('saves the form columns together with the admin settings and returns the id', async () => {
    result = { data: { id: ID }, error: null }
    const story = { business_name: 'Green Box' } as Parameters<typeof createStory>[0]
    await expect(createStory(story, { status: 'pending', is_sample: false })).resolves.toBe(ID)
    expect(calls).toContainEqual([
      'insert',
      { business_name: 'Green Box', status: 'pending', is_sample: false },
    ])
  })

  it('passes the database error on', async () => {
    result = { data: null, error: { code: '23514', message: 'check' } }
    const story = { business_name: 'x' } as Parameters<typeof createStory>[0]
    await expect(createStory(story, { status: 'pending', is_sample: false })).rejects.toEqual({
      code: '23514',
      message: 'check',
    })
  })
})
