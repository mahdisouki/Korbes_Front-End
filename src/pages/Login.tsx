import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DemoNote } from '../components/account/DemoNote.tsx'
import { TextField } from '../components/account/Fields.tsx'
import { loginUser } from '../data/accountStore.ts'
import { routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  usePageMeta(t('meta.login.title'), t('meta.login.description'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = loginUser(email, password)
    if (result === 'invalid') {
      setError(t('shop.errors.invalid'))
      document.getElementById('email')?.focus()
      return
    }
    const from = (location.state as { from?: string } | null)?.from
    navigate(from && from.startsWith('/') ? from : routes.account)
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <p className="eyebrow text-turquoise">{t('common.demo')}</p>
        <h1 className="mt-3 font-display text-5xl text-med">{t('shop.loginTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.loginText')}</p>
        <div className="mt-6">
          <DemoNote>{t('shop.demoBanner')}</DemoNote>
        </div>
        <form
          onSubmit={onSubmit}
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
            className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep"
          >
            {t('shop.loginSubmit')}
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to={routes.forgot} className="text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.forgotLink')}
            </Link>
            <Link to={routes.register} className="text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.registerLink')}
            </Link>
            <Link to={routes.guestAccess} className="text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.guestAccess')}
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}
