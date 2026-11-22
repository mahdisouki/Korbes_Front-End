import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { SelectField, TextField } from '../components/account/Fields.tsx'
import { routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { languages, type LanguageCode } from '../i18n/index.ts'
import { ApiError, apiJson, apiLocale } from '../lib/api.ts'
import { applySession, type SessionUser } from '../lib/session.ts'

type Field = 'firstName' | 'lastName' | 'email' | 'phone' | 'password' | 'form'
type Errors = Partial<Record<Field, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isLanguage(value: string): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

export function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  usePageMeta(t('meta.register.title'), t('meta.register.description'))
  const initialLanguage = isLanguage(i18n.language) ? i18n.language : 'fr'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Errors = {}
    if (firstName.trim().length < 2) next.firstName = t('shop.errors.firstName')
    if (lastName.trim().length < 2) next.lastName = t('shop.errors.lastName')
    if (!emailPattern.test(email.trim())) next.email = t('shop.errors.email')
    if (phone.replace(/\D/g, '').length < 8) next.phone = t('shop.errors.phone')
    if (password.length < 8) next.password = t('shop.errors.password')
    setErrors(next)
    if (Object.keys(next).length > 0) {
      document.getElementById(Object.keys(next)[0] ?? '')?.focus()
      return
    }
    setSubmitting(true)
    try {
      const body = await apiJson<{ data: { accessToken: string; refreshToken: string; user: SessionUser } }>(
        '/auth/register',
        {
          method: 'POST',
          headers: { 'Accept-Language': apiLocale(language) },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            language: apiLocale(language),
          }),
        },
      )
      applySession(body.data)
      void i18n.changeLanguage(language)
      navigate(routes.account)
    } catch (err) {
      setErrors({
        email: err instanceof ApiError && err.status === 409 ? t('shop.errors.duplicate') : undefined,
        form: err instanceof ApiError && err.status === 409 ? undefined : t('shop.errors.order'),
      })
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="mt-3 font-display text-5xl text-med">{t('shop.registerTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.registerText')}</p>
        <form
          onSubmit={(event) => {
            void onSubmit(event)
          }}
          noValidate
          className="mt-6 space-y-5 rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12,30,124,0.45)] sm:p-9"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="firstName"
              label={t('shop.firstName')}
              autoComplete="given-name"
              value={firstName}
              error={errors.firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              id="lastName"
              label={t('shop.lastName')}
              autoComplete="family-name"
              value={lastName}
              error={errors.lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <TextField
            id="email"
            type="email"
            dir="ltr"
            label={t('shop.email')}
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            id="phone"
            type="tel"
            dir="ltr"
            label={t('shop.phone')}
            autoComplete="tel"
            value={phone}
            error={errors.phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <TextField
            id="password"
            type="password"
            dir="ltr"
            label={t('shop.password')}
            autoComplete="new-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <SelectField
            id="language"
            label={t('shop.language')}
            value={language}
            onChange={(event) => {
              if (isLanguage(event.target.value)) setLanguage(event.target.value)
            }}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </SelectField>
          {errors.form ? <p className="text-sm text-med">{errors.form}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep disabled:opacity-60"
          >
            {submitting ? t('shop.submitting') : t('shop.registerSubmit')}
          </button>
          <p className="text-sm text-mist">
            {t('shop.hasAccount')}{' '}
            <Link to={routes.login} className="font-medium text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.loginLink')}
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
