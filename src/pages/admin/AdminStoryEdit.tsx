import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { StoryForm } from '../../components/StoryForm'
import { type AdminFields, createStory, fetchAnyStory, updateStory } from '../../data/adminApi'
import { STORY_STATUSES, type StoryStatus } from '../../data/options'
import {
  emptyStoryForm,
  type FormErrors,
  formToStory,
  type StoryFormValues,
  storyToForm,
  validateStoryForm,
} from '../../data/storyForm'
import { useLang } from '../../i18n/LangContext'
import { DbErrorMessage } from './DbErrorMessage'

type Loaded =
  | { kind: 'loading' }
  | { kind: 'error'; error: unknown }
  | { kind: 'missing' }
  | { kind: 'ready'; values: StoryFormValues; admin: AdminFields }

/** New story (/admin/new) or edit an existing one (/admin/story/:id). */
export function AdminStoryEdit() {
  const { id } = useParams()
  const isNew = id === undefined
  const [loaded, setLoaded] = useState<Loaded>(
    isNew
      ? { kind: 'ready', values: emptyStoryForm(), admin: { status: 'pending', is_sample: false } }
      : { kind: 'loading' },
  )

  useEffect(() => {
    if (id === undefined) return
    let current = true
    fetchAnyStory(id)
      .then((story) => {
        if (!current) return
        setLoaded(
          story
            ? {
                kind: 'ready',
                values: storyToForm(story),
                admin: { status: story.status, is_sample: story.is_sample },
              }
            : { kind: 'missing' },
        )
      })
      .catch((error) => current && setLoaded({ kind: 'error', error }))
    return () => {
      current = false
    }
  }, [id])

  const { t } = useLang()
  if (loaded.kind === 'loading') return <p className="text-ink/60">{t.admin.loading}</p>
  if (loaded.kind === 'error') return <DbErrorMessage error={loaded.error} />
  if (loaded.kind === 'missing') return <p>{t.admin.storyMissing}</p>

  // `key` gives a fresh editor when moving from one story to another.
  return <Editor key={id ?? 'new'} id={id} initial={loaded.values} initialAdmin={loaded.admin} />
}

function Editor({
  id,
  initial,
  initialAdmin,
}: {
  id: string | undefined
  initial: StoryFormValues
  initialAdmin: AdminFields
}) {
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const [values, setValues] = useState(initial)
  const [admin, setAdmin] = useState(initialAdmin)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saveError, setSaveError] = useState<unknown>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateStoryForm(values)
    setErrors(found)
    setSaveError(null)
    if (Object.keys(found).length > 0) return

    setSaving(true)
    try {
      const story = formToStory(values)
      if (id === undefined) await createStory(story, admin)
      else await updateStory(id, { ...story, ...admin })
      navigate(`/${lang}/admin`)
    } catch (error) {
      setSaveError(error)
      setSaving(false)
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <Link to={`/${lang}/admin`} className="text-sm text-brand underline">
        {t.admin.backToList}
      </Link>
      <h1 className="text-xl font-bold text-brand">
        {id === undefined ? t.admin.newStory : t.admin.edit}
      </h1>

      <AdminControls value={admin} onChange={setAdmin} />

      {hasErrors && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
          {t.form.hasErrors}
        </p>
      )}

      <StoryForm
        values={values}
        onChange={(next) => {
          setValues(next)
          // Re-check as the person fixes things, once they have tried to save.
          if (hasErrors) setErrors(validateStoryForm(next))
        }}
        errors={errors}
      />

      {saveError !== null && <DbErrorMessage error={saveError} />}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand px-6 py-2 font-semibold text-white disabled:opacity-60"
      >
        {saving ? t.admin.saving : t.admin.save}
      </button>
    </form>
  )
}

/** Status and the sample flag: admin-only, so they stay outside the shared StoryForm. */
function AdminControls({
  value,
  onChange,
}: {
  value: AdminFields
  onChange: (value: AdminFields) => void
}) {
  const { t } = useLang()
  return (
    <fieldset className="space-y-3 rounded-2xl border border-accent/40 bg-accent/5 p-4">
      <legend className="px-1 font-bold text-brand">{t.admin.adminControls}</legend>
      <label className="block">
        <span className="text-sm font-semibold">{t.admin.statusField}</span>
        <select
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as StoryStatus })}
          className="mt-1 block w-full rounded-xl border border-ink/20 bg-white px-3 py-2"
        >
          {STORY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {t.admin.status[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.is_sample}
          onChange={(e) => onChange({ ...value, is_sample: e.target.checked })}
        />
        {t.admin.isSample}
      </label>
    </fieldset>
  )
}
