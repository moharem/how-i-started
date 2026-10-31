import { describe, expect, it } from 'vitest'
import { isCacheableStoriesRequest } from './storiesCache'

const API = 'https://qbikujozfytbaqnennxx.supabase.co/rest/v1/stories'
const check = (url: string, method = 'GET') =>
  isCacheableStoriesRequest({ url: new URL(url), request: { method } })

describe('isCacheableStoriesRequest', () => {
  it('caches the public list of published stories', () => {
    expect(check(`${API}?select=*&status=eq.published&order=published_at.desc`)).toBe(true)
  })

  it('caches one published story', () => {
    expect(check(`${API}?select=*&status=eq.published&id=eq.3f2b8c1e`)).toBe(true)
  })

  it('never caches a read without the published filter (admin reads)', () => {
    expect(check(`${API}?select=*&order=created_at.desc`)).toBe(false)
  })

  it('never caches a read for another status', () => {
    expect(check(`${API}?select=*&status=eq.pending`)).toBe(false)
  })

  it('never caches a read with a second status filter', () => {
    expect(check(`${API}?status=eq.published&status=neq.published`)).toBe(false)
  })

  it('never caches writes', () => {
    expect(check(`${API}?status=eq.published`, 'PATCH')).toBe(false)
  })

  it('never caches other database calls', () => {
    expect(
      check('https://qbikujozfytbaqnennxx.supabase.co/rest/v1/rpc/is_admin?status=eq.published'),
    ).toBe(false)
  })

  it('never caches other hosts', () => {
    expect(check('https://example.com/rest/v1/stories?status=eq.published')).toBe(false)
  })
})
