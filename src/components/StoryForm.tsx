import { type ReactNode, useId } from 'react'
import {
  CAPITAL_RANGES,
  GOVERNORATES,
  INDUSTRIES,
  MONEY_SOURCES,
  OUTCOMES,
  WORK_MODES,
} from '../data/options'
import { STORY_QUESTIONS } from '../data/story'
import type { FormError, FormErrors, StoryFormValues } from '../data/storyForm'
import { useLang } from '../i18n/LangContext'
import { dirOf, LANGS, type Lang } from '../i18n/lang'

/**
 * The story fields, shared by the admin form and the founder form (step 5). It only
 * shows inputs and messages: the page around it owns the <form>, the submit button,
 * validation (`validateStoryForm`) and saving. Keep admin-only controls out of here.
 *
 * Labels are in the interface language. Everything the person types is in the
 * story's language, so every free-text input gets the story's `dir` and `lang`
 * while typing (never dir="auto": see "Mixed text" in AGENTS.md).
 */
export function StoryForm({
  values,
  onChange,
  errors,
}: {
  values: StoryFormValues
  onChange: (values: StoryFormValues) => void
  errors: FormErrors
}) {
  const { lang: uiLang, t } = useLang()
  const f = t.form
  const set = <K extends keyof StoryFormValues>(key: K, value: StoryFormValues[K]) =>
    onChange({ ...values, [key]: value })
  const storyLang = values.lang === '' ? null : values.lang

  return (
    <div className="space-y-6">
      <Section title={f.storyLang}>
        <p className="text-sm text-ink/60">{f.storyLangHint}</p>
        <div className="flex gap-2">
          {LANGS.map((code) => (
            <Choice
              key={code}
              name="story-lang"
              checked={values.lang === code}
              onChange={() => set('lang', code)}
            >
              <span lang={code}>{code === 'ar' ? f.langAr : f.langEn}</span>
            </Choice>
          ))}
        </div>
        <ErrorText error={errors.lang} />
      </Section>

      {storyLang === null ? (
        <p className="text-ink/60">{f.pickLangFirst}</p>
      ) : (
        <StoryFields
          values={values}
          set={set}
          errors={errors}
          storyLang={storyLang}
          uiLang={uiLang}
        />
      )}
    </div>
  )
}

type Setter = <K extends keyof StoryFormValues>(key: K, value: StoryFormValues[K]) => void

function StoryFields({
  values,
  set,
  errors,
  storyLang,
  uiLang,
}: {
  values: StoryFormValues
  set: Setter
  errors: FormErrors
  storyLang: Lang
  uiLang: Lang
}) {
  const { t } = useLang()
  const f = t.form
  // Props for every input the person types words into.
  const typed = { dir: dirOf(storyLang), lang: storyLang }
  const text = (key: keyof StoryFormValues) => ({
    ...typed,
    value: String(values[key]),
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as never),
  })
  const number = (key: keyof StoryFormValues) => ({
    inputMode: 'numeric' as const,
    value: String(values[key]),
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as never),
  })
  const options = (list: Record<string, Record<Lang, string>>) =>
    Object.entries(list).map(([key, label]) => ({ key, label: label[uiLang] }))

  return (
    <>
      <Section title={f.sectionBusiness}>
        <Field label={f.businessName} error={errors.business_name}>
          {(id) => <input id={id} className={inputClass} {...text('business_name')} />}
        </Field>
        <Field label={f.founderName} hint={f.founderNameHint} optional error={errors.founder_name}>
          {(id) => <input id={id} className={inputClass} {...text('founder_name')} />}
        </Field>
        <Field label={f.industry} error={errors.industry}>
          {(id) => (
            <Select
              id={id}
              value={values.industry}
              onChange={(v) => set('industry', v as StoryFormValues['industry'])}
              options={options(INDUSTRIES)}
            />
          )}
        </Field>
        {values.industry === 'other' && (
          <Field label={f.industryOther} error={errors.industry_other}>
            {(id) => <input id={id} className={inputClass} {...text('industry_other')} />}
          </Field>
        )}
      </Section>

      <Section title={f.sectionPlace}>
        <div className="flex flex-wrap gap-2">
          <Choice
            name="location-type"
            checked={values.location_type === 'egypt'}
            onChange={() => set('location_type', 'egypt')}
          >
            {f.inEgypt}
          </Choice>
          <Choice
            name="location-type"
            checked={values.location_type === 'abroad'}
            onChange={() => set('location_type', 'abroad')}
          >
            {f.outsideEgypt}
          </Choice>
        </div>
        {values.location_type === 'egypt' ? (
          <Field label={f.governorate} error={errors.governorate}>
            {(id) => (
              <Select
                id={id}
                value={values.governorate}
                onChange={(v) => set('governorate', v as StoryFormValues['governorate'])}
                options={options(GOVERNORATES)}
              />
            )}
          </Field>
        ) : (
          <Field label={f.country} error={errors.country}>
            {(id) => <input id={id} className={inputClass} {...text('country')} />}
          </Field>
        )}
        <Field label={f.city} optional error={errors.city}>
          {(id) => <input id={id} className={inputClass} {...text('city')} />}
        </Field>
      </Section>

      <Section title={f.sectionStart}>
        <Field label={f.yearStarted} error={errors.year_started}>
          {(id) => <input id={id} className={numberClass} {...number('year_started')} />}
        </Field>
        <Field label={f.capitalRange} error={errors.capital_range}>
          {(id) => (
            <Select
              id={id}
              value={values.capital_range}
              onChange={(v) => set('capital_range', v as StoryFormValues['capital_range'])}
              options={options(CAPITAL_RANGES)}
            />
          )}
        </Field>
        <Field label={f.capitalExact} optional error={errors.capital_exact}>
          {(id) => <input id={id} className={numberClass} {...number('capital_exact')} />}
        </Field>
        <Field
          label={f.currencyNote}
          hint={f.currencyNoteHint}
          optional
          error={errors.currency_note}
        >
          {(id) => <input id={id} className={inputClass} {...text('currency_note')} />}
        </Field>
        <Field label={f.moneySource} error={errors.money_source}>
          {(id) => (
            <Select
              id={id}
              value={values.money_source}
              onChange={(v) => set('money_source', v as StoryFormValues['money_source'])}
              options={options(MONEY_SOURCES)}
            />
          )}
        </Field>
        <Field label={f.workMode} error={errors.work_mode}>
          {(id) => (
            <Select
              id={id}
              value={values.work_mode}
              onChange={(v) => set('work_mode', v as StoryFormValues['work_mode'])}
              options={options(WORK_MODES)}
            />
          )}
        </Field>
        <Field label={f.keptJob} optional error={errors.kept_job}>
          {(id) => (
            <Select
              id={id}
              value={values.kept_job}
              onChange={(v) => set('kept_job', v as StoryFormValues['kept_job'])}
              options={[
                { key: 'yes', label: t.yes },
                { key: 'no', label: t.no },
              ]}
              emptyLabel={f.notSaid}
            />
          )}
        </Field>
        <Field label={f.teamAtStart} optional error={errors.team_size_start}>
          {(id) => <input id={id} className={numberClass} {...number('team_size_start')} />}
        </Field>
      </Section>

      <Section title={f.sectionMilestones}>
        <Field label={f.monthsToRevenue} hint={f.monthsHint} error={errors.months_to_revenue}>
          {(id) => <input id={id} className={numberClass} {...number('months_to_revenue')} />}
        </Field>
        <Field label={f.monthsToProfit} optional error={errors.months_to_profit}>
          {(id) => (
            <input
              id={id}
              className={numberClass}
              disabled={values.profit_not_yet}
              {...number('months_to_profit')}
            />
          )}
        </Field>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.profit_not_yet}
            onChange={(e) => set('profit_not_yet', e.target.checked)}
          />
          {f.profitNotYet}
        </label>
        <Field label={f.outcome} error={errors.outcome}>
          {(id) => (
            <Select
              id={id}
              value={values.outcome}
              onChange={(v) => set('outcome', v as StoryFormValues['outcome'])}
              options={options(OUTCOMES)}
            />
          )}
        </Field>
      </Section>

      <Section title={f.sectionToday}>
        <Field label={f.teamNow} optional error={errors.team_size_now}>
          {(id) => <input id={id} className={numberClass} {...number('team_size_now')} />}
        </Field>
        <Field label={f.stageNow} optional error={errors.stage_now}>
          {(id) => <input id={id} className={inputClass} {...text('stage_now')} />}
        </Field>
      </Section>

      <Section title={f.sectionQuestions}>
        <p className="text-sm text-ink/60">{f.questionsHint}</p>
        <ErrorText error={errors.answers} />
        {STORY_QUESTIONS.map((q) => (
          <Field key={q} label={t.questions[q]} error={errors[q]}>
            {(id) => <textarea id={id} rows={4} className={inputClass} {...text(q)} />}
          </Field>
        ))}
      </Section>
    </>
  )
}

const inputClass =
  'mt-1 block w-full rounded-xl border border-ink/20 bg-white px-3 py-2 disabled:bg-ink/5'
const numberClass = `${inputClass} max-w-40`

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-ink/10 bg-white p-4">
      <legend className="px-1 font-bold text-brand">{title}</legend>
      {children}
    </fieldset>
  )
}

/** A labeled input with an optional hint and error. The input gets the generated id. */
export function Field({
  label,
  hint,
  optional,
  error,
  children,
}: {
  label: string
  hint?: string
  optional?: boolean
  error?: FormError
  children: (id: string) => ReactNode
}) {
  const { t } = useLang()
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {optional && <span className="ms-1 font-normal text-ink/50">({t.form.optional})</span>}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-ink/60">{hint}</p>}
      <ErrorText error={error} />
    </div>
  )
}

function ErrorText({ error }: { error?: FormError }) {
  const { t } = useLang()
  if (!error) return null
  return (
    <p role="alert" className="mt-1 text-sm text-red-700">
      {t.formErrors[error]}
    </p>
  )
}

function Choice({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 ${
        checked ? 'border-brand bg-brand/10 text-brand' : 'border-ink/20'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      {children}
    </label>
  )
}

function Select({
  id,
  value,
  onChange,
  options,
  emptyLabel,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: { key: string; label: string }[]
  emptyLabel?: string
}) {
  const { t } = useLang()
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">{emptyLabel ?? t.form.choose}</option>
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
