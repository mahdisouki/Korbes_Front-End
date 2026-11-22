import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { TextField } from '../components/account/Fields.tsx'
import { routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { ApiError, apiJson } from '../lib/api.ts'

export function ForgotPassword() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  usePageMeta(t('meta.forgot.title'), t('meta.forgot.description'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (token) {
      if (password.length < 8) {
        setError(t('shop.errors.password'))
        return
      }
      if (password !== confirm) {
        setError(t('shop.errors.confirm'))
        return
      }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(t('shop.errors.email'))
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (token) {
        await apiJson('/auth/password/reset', {
          method: 'POST',
          body: JSON.stringify({ token, password }),
        })
      } else {
        await apiJson('/auth/password/forgot', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim() }),
        })
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? t('shop.errors.order') : t('shop.errors.order'))
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-display text-5xl text-med">{t('shop.forgotTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{token ? t('shop.resetText') : t('shop.forgotText')}</p>
        {done ? (
          <div className="mt-6 rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12,30,124,0.45)]">
            <p className="leading-relaxed text-ink">{token ? t('shop.resetDone') : t('shop.forgotSent')}</p>
            <Link to={routes.login} className="mt-6 inline-flex rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white">
              {t('shop.loginLink')}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              void onSubmit(event)
            }}
            noValidate
            className="mt-6 space-y-5 rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12,30,124,0.45)] sm:p-9"
          >
            {token ? (
              <>
                <TextField
                  id="password"
                  type="password"
                  dir="ltr"
                  label={t('shop.newPassword')}
                  autoComplete="new-password"
                  value={password}
                  error={error}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                  }}
                />
                <TextField
                  id="confirm"
                  type="password"
                  dir="ltr"
                  label={t('shop.confirmPassword')}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => {
                    setConfirm(event.target.value)
                    setError('')
                  }}
                />
              </>
            ) : (
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
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep disabled:opacity-60"
            >
              {submitting ? t('shop.submitting') : token ? t('shop.resetSubmit') : t('shop.forgotSubmit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
