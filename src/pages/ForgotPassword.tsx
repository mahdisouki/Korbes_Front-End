import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DemoNote } from '../components/account/DemoNote.tsx'
import { TextField } from '../components/account/Fields.tsx'
import { findUserByEmail, resetPassword } from '../data/accountStore.ts'
import { routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function ForgotPassword() {
  const { t } = useTranslation()
  usePageMeta(t('meta.forgot.title'), t('meta.forgot.description'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const lookup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!findUserByEmail(email)) {
      setError(t('shop.errors.unknownEmail'))
      setReady(false)
      return
    }
    setError('')
    setReady(true)
  }

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password.length < 8) {
      setError(t('shop.errors.password'))
      return
    }
    if (password !== confirm) {
      setError(t('shop.errors.confirm'))
      return
    }
    const result = resetPassword(email, password)
    if (result === 'unknown') {
      setError(t('shop.errors.unknownEmail'))
      setReady(false)
      return
    }
    setError('')
    setDone(true)
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <p className="eyebrow text-turquoise">{t('common.demo')}</p>
        <h1 className="mt-3 font-display text-5xl text-med">{t('shop.forgotTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.forgotText')}</p>
        <div className="mt-6">
          <DemoNote>{t('shop.demoBanner')}</DemoNote>
        </div>
        {done ? (
          <div className="mt-6 rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.45)]">
            <p className="leading-relaxed text-ink">{t('shop.resetDone')}</p>
            <Link to={routes.login} className="mt-6 inline-flex rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white">
              {t('shop.loginLink')}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={ready ? save : lookup}
            noValidate
            className="mt-6 space-y-5 rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.45)] sm:p-9"
          >
            <TextField
              id="email"
              type="email"
              dir="ltr"
              label={t('shop.email')}
              autoComplete="email"
              value={email}
              disabled={ready}
              error={!ready ? error : undefined}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
            />
            {ready ? (
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
            ) : null}
            <button
              type="submit"
              className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep"
            >
              {ready ? t('shop.resetSubmit') : t('shop.forgotSubmit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
