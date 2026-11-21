import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DemoNote } from '../components/account/DemoNote.tsx'
import { TextField } from '../components/account/Fields.tsx'
import { orderForGuest } from '../data/accountStore.ts'
import { orderPath } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function GuestAccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  usePageMeta(t('meta.guest.title'), t('meta.guest.description'))
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const order = orderForGuest(email, orderId)
    if (!order) {
      setError(t('shop.guestError'))
      return
    }
    navigate(orderPath(order.id))
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <p className="eyebrow text-turquoise">{t('common.demo')}</p>
        <h1 className="mt-3 font-display text-5xl text-med">{t('shop.guestTitle')}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.guestText')}</p>
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
            className="w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep"
          >
            {t('shop.guestSubmit')}
          </button>
        </form>
      </div>
    </section>
  )
}
