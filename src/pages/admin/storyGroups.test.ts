import { describe, expect, it } from 'vitest'
import { groupByStatus, sampleToggle } from './storyGroups'

describe('groupByStatus', () => {
  it('puts each story under its status, keeping the order', () => {
    const stories = [
      { id: 'a', status: 'published' },
      { id: 'b', status: 'pending' },
      { id: 'c', status: 'published' },
    ] as const
    const groups = groupByStatus([...stories])
    expect(groups.published.map((s) => s.id)).toEqual(['a', 'c'])
    expect(groups.pending.map((s) => s.id)).toEqual(['b'])
    expect(groups.unpublished).toEqual([])
  })
})

describe('sampleToggle', () => {
  it('offers "hide" while any sample is published', () => {
    expect(
      sampleToggle([
        { is_sample: true, status: 'published' },
        { is_sample: true, status: 'unpublished' },
      ]),
    ).toBe('hide')
  })

  it('offers "show" when every sample is hidden', () => {
    expect(sampleToggle([{ is_sample: true, status: 'unpublished' }])).toBe('show')
  })

  it('offers nothing when there are no samples', () => {
    expect(sampleToggle([{ is_sample: false, status: 'published' }])).toBeNull()
  })
})
