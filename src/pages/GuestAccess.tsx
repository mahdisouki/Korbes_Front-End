import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { TextField } from '../components/account/Fields.tsx'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { apiJson } from '../lib/api.ts'

export function GuestAccess() {
  const { t } = useTranslation()
  usePageMeta(t('meta.guest.title'), t('meta.guest.description'))
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) || orderId.trim().length < 4) {
      setError(t('shop.guestError'))
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await apiJson('/orders/access', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), orderCode: orderId.trim() }),
      })
      setSent(true)
    } catch {
      setError(t('shop.errors.order'))
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-display text-5xl text-med">{t('shop.guestTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.guestText')}</p>
        {sent ? (
          <p className="mt-6 rounded-[1.75rem] bg-white p-7 leading-relaxed text-ink">{t('shop.guestSent')}</p>
        ) : (
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
              id="orderId"
              dir="ltr"
              label={t('shop.orderId')}
              autoComplete="off"
              value={orderId}
              onChange={(event) => {
                setOrderId(event.target.value)
                setError('')
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep disabled:opacity-60"
            >
              {submitting ? t('shop.submitting') : t('shop.guestSubmit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
