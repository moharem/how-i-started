import { describe, expect, it } from 'vitest'
import { describeDbError } from './dbError'

describe('describeDbError', () => {
  it('names the broken rule from a check constraint error', () => {
    const error = {
      code: '23514',
      message: 'new row for relation "stories" violates check constraint "location_complete"',
    }
    expect(describeDbError(error)).toEqual({ kind: 'location', detail: error.message })
  })

  it('recognises the future-year trigger', () => {
    const error = { code: '23514', message: 'year_started cannot be in the future' }
    expect(describeDbError(error).kind).toBe('futureYear')
  })

  it('falls back to "invalid value" for an unlisted constraint', () => {
    const error = {
      code: '23514',
      message: 'new row for relation "stories" violates check constraint "stories_city_check"',
    }
    expect(describeDbError(error).kind).toBe('invalidValue')
  })

  it('reports a Row Level Security refusal as missing permission', () => {
    const error = { code: '42501', message: 'new row violates row-level security policy' }
    expect(describeDbError(error).kind).toBe('noPermission')
  })

  it('reports "no row changed" as missing permission', () => {
    expect(describeDbError({ code: 'PGRST116', message: 'no rows' }).kind).toBe('noPermission')
  })

  it('recognises a lost connection', () => {
    expect(describeDbError(new TypeError('Failed to fetch')).kind).toBe('network')
  })

  it('keeps the database message for anything else', () => {
    expect(describeDbError({ code: 'XX000', message: 'boom' })).toEqual({
      kind: 'unknown',
      detail: 'boom',
    })
  })
})
