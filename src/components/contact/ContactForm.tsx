import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

type Field = 'fullName' | 'email' | 'phone' | 'subject' | 'message'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const empty: Values = { fullName: '', email: '', phone: '', subject: '', message: '' }

function validate(values: Values, t: (key: string) => string): Errors {
  const errors: Errors = {}
  if (values.fullName.trim().length < 2) errors.fullName = t('contact.errors.name')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = t('contact.errors.email')
  if (values.phone.replace(/\D/g, '').length < 8) errors.phone = t('contact.errors.phone')
  if (values.subject.trim().length < 3) errors.subject = t('contact.errors.subject')
  if (values.message.trim().length < 20) errors.message = t('contact.errors.message')
  return errors
}

export function ContactForm() {
  const { t } = useTranslation()
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [ready, setReady] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validate(values, t)
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setReady(false)
      const first = Object.keys(next)[0]
      if (first) document.getElementById(first)?.focus()
      return
    }
    setReady(true)
  }

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setReady(false)
  }

  if (ready) {
    return (
      <div role="status" className="rounded-[1.75rem] bg-white p-8 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.45)]">
        <p className="eyebrow text-turquoise">{t('common.demo')}</p>
        <h2 className="mt-3 font-display text-4xl text-med">{t('contact.successTitle')}</h2>
        <p className="mt-4 leading-relaxed text-mist">{t('contact.successText')}</p>
        <button
          type="button"
          className="mt-6 rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white"
          onClick={() => {
            setValues(empty)
            setReady(false)
          }}
        >
          {t('contact.reset')}
        </button>
      </div>
    )
  }

  const fields: Array<{ id: Field; type: string; autoComplete: string; dir?: 'ltr' }> = [
    { id: 'fullName', type: 'text', autoComplete: 'name' },
    { id: 'email', type: 'email', autoComplete: 'email', dir: 'ltr' },
    { id: 'phone', type: 'tel', autoComplete: 'tel', dir: 'ltr' },
    { id: 'subject', type: 'text', autoComplete: 'off' },
  ]

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.45)] sm:p-9"
    >
      <h2 className="font-display text-4xl text-med">{t('contact.formTitle')}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <Field
            key={field.id}
            id={field.id}
            type={field.type}
            autoComplete={field.autoComplete}
            dir={field.dir}
            label={t(`contact.${field.id === 'fullName' ? 'name' : field.id}`)}
            placeholder={t(
              `contact.${field.id === 'fullName' ? 'name' : field.id}Placeholder`,
            )}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={(value) => update(field.id, value)}
            wide={false}
          />
        ))}
        <Field
          id="message"
          type="textarea"
          autoComplete="off"
          label={t('contact.message')}
          placeholder={t('contact.messagePlaceholder')}
          value={values.message}
          error={errors.message}
          onChange={(value) => update('message', value)}
          wide
        />
      </div>
      <button
        type="submit"
        className="mt-6 rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep"
      >
        {t('contact.submit')}
      </button>
    </form>
  )
}

function Field({
  id,
  type,
  label,
  placeholder,
  value,
  error,
  onChange,
  autoComplete,
  dir,
  wide,
}: {
  id: string
  type: string
  label: string
  placeholder: string
  value: string
  error?: string
  onChange: (value: string) => void
  autoComplete: string
  dir?: 'ltr'
  wide?: boolean
}) {
  const { t } = useTranslation()
  const errorId = `${id}-error`
  const shared =
    'mt-2 w-full rounded-2xl border bg-beige px-4 py-3 text-ink outline-none transition focus:border-turquoise'

  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        <span className="ms-1 text-turquoise" aria-hidden>
          *
        </span>
        <span className="sr-only">{t('common.required')}</span>
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          rows={6}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${shared} ${error ? 'border-mist' : 'border-transparent'}`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          dir={dir}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${shared} ${error ? 'border-mist' : 'border-transparent'}`}
        />
      )}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-med">
          {error}
        </p>
      ) : null}
    </div>
  )
}
