// Turns a database error into something a person can act on. The database is the
// authority on what may be saved; this only explains its answer.

/** Known reasons. Each one has a message in the dictionary (`t.dbErrors`). */
export type DbErrorKind =
  | 'noPermission'
  | 'industryOther'
  | 'location'
  | 'amountOutsideRange'
  | 'profitConflict'
  | 'needOneAnswer'
  | 'futureYear'
  | 'invalidValue'
  | 'network'
  | 'unknown'

export type DbErrorInfo = {
  kind: DbErrorKind
  /** The database's own words, shown under the friendly message so nothing is hidden. */
  detail: string
}

// Constraint names from supabase/migrations.
const CONSTRAINTS: Record<string, DbErrorKind> = {
  industry_other_needed: 'industryOther',
  location_complete: 'location',
  capital_exact_in_range: 'amountOutsideRange',
  profit_consistent: 'profitConflict',
  at_least_one_answer: 'needOneAnswer',
}

type ErrorLike = { code?: unknown; message?: unknown }

export function describeDbError(error: unknown): DbErrorInfo {
  const { code, message } = (error ?? {}) as ErrorLike
  const detail = typeof message === 'string' ? message : String(error)

  // 42501: insufficient privilege, including a Row Level Security refusal.
  // PGRST116: an update or read that matched no row the user is allowed to see.
  if (code === '42501' || code === 'PGRST116') return { kind: 'noPermission', detail }
  if (code === '23514') {
    if (detail.includes('year_started cannot be in the future')) {
      return { kind: 'futureYear', detail }
    }
    const name = detail.match(/constraint "([^"]+)"/)?.[1]
    return { kind: (name && CONSTRAINTS[name]) || 'invalidValue', detail }
  }
  if (error instanceof TypeError || /failed to fetch|network/i.test(detail)) {
    return { kind: 'network', detail }
  }
  return { kind: 'unknown', detail }
}
