/**
 * Which story requests the service worker may keep for offline reading.
 *
 * Only reads that ask for published stories (`status=eq.published`) are cached.
 * Admin reads include pending and unpublished stories and never send that filter,
 * so they are never stored and can never be served to a public page.
 *
 * Workbox copies this function's source text into the service worker, so it must
 * not use anything from outside its own body.
 */
export function isCacheableStoriesRequest({
  url,
  request,
}: {
  url: URL
  request: { method: string }
}): boolean {
  return (
    request.method === 'GET' &&
    url.hostname.endsWith('.supabase.co') &&
    url.pathname === '/rest/v1/stories' &&
    url.searchParams.getAll('status').length === 1 &&
    url.searchParams.get('status') === 'eq.published'
  )
}
