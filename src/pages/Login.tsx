import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TextField } from '../components/account/Fields.tsx'
import { routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { ApiError, apiJson, apiLocale } from '../lib/api.ts'
import { applySession, type SessionUser } from '../lib/session.ts'

export function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  usePageMeta(t('meta.login.title'), t('meta.login.description'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const body = await apiJson<{ data: { accessToken: string; refreshToken: string; user: SessionUser } }>(
        '/auth/login',
        {
          method: 'POST',
          headers: { 'Accept-Language': apiLocale(i18n.language) },
          body: JSON.stringify({ email: email.trim(), password }),
        },
      )
      applySession(body.data)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from.startsWith('/') ? from : routes.account)
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? t('shop.errors.invalid') : t('shop.errors.order'))
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-display text-5xl text-med">{t('shop.loginTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.loginText')}</p>
        <form
          onSubmit={(event) => {
            void onSubmit(event)
          }}
          noValidate
          className="mt-6 space-y-5 rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12,30,124,0.45)] sm:p-9"
        >
          <TextField
            id="email"
            type="email"
            dir="ltr"
            label={t('shop.email')}
            autoComplete="email"
            value={email}
            error={error}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
          />
          <TextField
            id="password"
            type="password"
            dir="ltr"
            label={t('shop.password')}
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep disabled:opacity-60"
          >
            {submitting ? t('shop.submitting') : t('shop.loginSubmit')}
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to={routes.forgot} className="text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.forgotLink')}
            </Link>
            <Link to={routes.register} className="text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.registerLink')}
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}
