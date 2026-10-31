import { describeDbError } from '../../data/dbError'
import { useLang } from '../../i18n/LangContext'

/** A friendly explanation of a database refusal, with the database's own words below it. */
export function DbErrorMessage({ error }: { error: unknown }) {
  const { t } = useLang()
  const { kind, detail } = describeDbError(error)
  return (
    <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
      <p className="font-semibold">{t.dbErrors[kind]}</p>
      <p className="mt-1 text-xs text-red-800/80">
        {t.dbErrorDetail}{' '}
        <bdi dir="ltr" lang="en">
          {detail}
        </bdi>
      </p>
    </div>
  )
}
