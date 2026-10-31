import type { Session } from '@supabase/supabase-js'
import { type FormEvent, useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { checkIsAdmin } from '../../data/adminApi'
import { useLang } from '../../i18n/LangContext'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../lib/usePageTitle'

type Access =
  | { kind: 'loading' }
  | { kind: 'signedOut' }
  | { kind: 'checking' }
  | { kind: 'denied' }
  | { kind: 'checkFailed' }
  | { kind: 'admin' }

/**
 * Wraps every /:lang/admin page. Shows the login form when logged out, a "no access"
 * message for accounts that are not admins, and the admin pages for admins.
 * This only decides what to show: the database refuses admin reads and writes
 * from anyone who is not in public.admins, whatever this page does.
 */
export function AdminArea() {
  const { lang, t } = useLang()
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [access, setAccess] = useState<Access>({ kind: 'loading' })
  usePageTitle(t.admin.title)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  // Ask the database again whenever the logged-in user changes.
  const userId = session?.user.id
  useEffect(() => {
    if (session === undefined) return
    if (!userId) {
      setAccess({ kind: 'signedOut' })
      return
    }
    let current = true
    setAccess({ kind: 'checking' })
    checkIsAdmin()
      .then((ok) => current && setAccess({ kind: ok ? 'admin' : 'denied' }))
      .catch(() => current && setAccess({ kind: 'checkFailed' }))
    return () => {
      current = false
    }
  }, [session, userId])

  const logOut = () => supabase.auth.signOut()

  return (
    <section className="py-4">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-bold">{t.admin.title}</span>
        {access.kind === 'admin' && (
          <>
            <NavLink to={`/${lang}/admin`} end className="text-brand underline">
              {t.admin.stories}
            </NavLink>
            <NavLink to={`/${lang}/admin/new`} className="text-brand underline">
              {t.admin.newStory}
            </NavLink>
          </>
        )}
        {userId && (
          <button type="button" onClick={logOut} className="ms-auto text-brand underline">
            {t.admin.logOut}
          </button>
        )}
      </div>

      {(access.kind === 'loading' || access.kind === 'checking') && (
        <p className="text-ink/60">{t.admin.checking}</p>
      )}
      {access.kind === 'signedOut' && <LoginForm />}
      {access.kind === 'denied' && (
        <div>
          <p>{t.admin.noAccess}</p>
          <Link to={`/${lang}`} className="mt-3 inline-block text-brand underline">
            {t.backHome}
          </Link>
        </div>
      )}
      {access.kind === 'checkFailed' && <p>{t.admin.checkFailed}</p>}
      {access.kind === 'admin' && <Outlet />}
    </section>
  )
}

/** Email and password only. Sign-ups are turned off in Supabase, and there is no sign-up UI. */
function LoginForm() {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  // 'wrong': the login was refused. 'other': no connection or another problem.
  const [failed, setFailed] = useState<null | 'wrong' | 'other'>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFailed(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setFailed(error.status === 400 ? 'wrong' : 'other')
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-4">
      <h1 className="text-xl font-bold text-brand">{t.admin.loginTitle}</h1>
      <label className="block">
        <span className="text-sm font-semibold">{t.admin.email}</span>
        {/* Email addresses are always left to right. */}
        <input
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-ink/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t.admin.password}</span>
        <input
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-ink/20 px-3 py-2"
        />
      </label>
      {failed && (
        <p role="alert" className="text-sm text-red-700">
          {failed === 'wrong' ? t.admin.loginFailed : t.dbErrors.network}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-brand px-5 py-2 font-semibold text-white disabled:opacity-60"
      >
        {busy ? t.admin.loggingIn : t.admin.logIn}
      </button>
    </form>
  )
}
