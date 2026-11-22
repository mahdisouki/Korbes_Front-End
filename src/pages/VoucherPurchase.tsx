import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DemoNote } from '../components/account/DemoNote.tsx'
import { SelectField, TextField } from '../components/account/Fields.tsx'
import { placeOrder } from '../data/accountStore.ts'
import { formatMillimes, todayIso } from '../data/format.ts'
import { orderPath, routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicVouchers } from '../hooks/usePublicVouchers.ts'
import { useUser } from '../hooks/useAccount.ts'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function VoucherPurchase() {
  const { slug = '' } = useParams()
  const { status, vouchers } = usePublicVouchers()
  const voucher = vouchers.find((item) => item.slug.toLowerCase() === slug.trim().toLowerCase()) ?? null
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const user = useUser()
  const [today] = useState(todayIso)
  const [visitDate, setVisitDate] = useState('')
  const [beneficiary, setBeneficiary] = useState(user ? `${user.firstName} ${user.lastName}` : '')
  const [quantity, setQuantity] = useState('1')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  usePageMeta(
    voucher ? t('meta.purchase.title', { name: voucher.name }) : t('meta.vouchers.title'),
    t('meta.purchase.description'),
  )

  if (status === 'loading') {
    return (
      <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
        <p className="mx-auto max-w-xl text-sm text-mist">{t('shop.loading')}</p>
      </section>
    )
  }

  if (status === 'error' || !voucher) {
    return (
      <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-xl">
          <h1 className="font-display text-5xl text-med">
            {status === 'error' ? t('shop.loadError') : t('shop.missingVoucher')}
          </h1>
          <Link to={routes.vouchers} className="mt-6 inline-flex text-turquoise-deep underline-offset-2 hover:underline">
            {t('shop.backCatalogue')}
          </Link>
        </div>
      </section>
    )
  }

  const count = Number(quantity)
  const total = voucher.publicPrice * (Number.isFinite(count) ? count : 0)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!visitDate || visitDate < today) next.visitDate = t('shop.errors.date')
    if (beneficiary.trim().length < 2) next.beneficiary = t('shop.errors.beneficiary')
    if (!Number.isInteger(count) || count < 1 || count > 4) next.quantity = t('shop.errors.quantity')
    if (!emailPattern.test(email.trim())) next.email = t('shop.errors.email')
    if (phone.replace(/\D/g, '').length < 8) next.phone = t('shop.errors.phone')
    setErrors(next)
    if (Object.keys(next).length > 0) {
      document.getElementById(Object.keys(next)[0] ?? '')?.focus()
      return
    }
    const id = placeOrder({
      email,
      phone,
      userId: user?.id ?? null,
      voucherSlug: voucher.slug,
      visitDate,
      beneficiary: beneficiary.trim() || '—',
      quantity: count,
      unitPrice: voucher.publicPrice / 1000,
      currency: 'TND',
    })
    navigate(orderPath(id))
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.45)] sm:p-9"
        >
          <p className="eyebrow text-turquoise">{t('common.demo')}</p>
          <h1 className="mt-3 font-display text-5xl text-med">{voucher.name}</h1>
          {voucher.description ? <p className="mt-4 leading-relaxed text-mist">{voucher.description}</p> : null}
          {voucher.conditions ? (
            <div className="mt-4">
              <h2 className="text-sm font-medium text-med">{t('catalog.fields.conditions')}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-mist">{voucher.conditions}</p>
            </div>
          ) : null}
          <div className="mt-6">
            <DemoNote>{t('shop.payNote')}</DemoNote>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <TextField
              id="visitDate"
              type="date"
              dir="ltr"
              min={today}
              label={t('shop.visitDate')}
              value={visitDate}
              error={errors.visitDate}
              onChange={(event) => setVisitDate(event.target.value)}
            />
            <SelectField
              id="quantity"
              label={t('shop.quantity')}
              value={quantity}
              error={errors.quantity}
              onChange={(event) => setQuantity(event.target.value)}
            >
              {['1', '2', '3', '4'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </SelectField>
            <TextField
              id="beneficiary"
              className="sm:col-span-2"
              label={t('shop.beneficiary')}
              autoComplete="name"
              value={beneficiary}
              error={errors.beneficiary}
              onChange={(event) => setBeneficiary(event.target.value)}
            />
            <TextField
              id="email"
              type="email"
              dir="ltr"
              label={t('shop.email')}
              autoComplete="email"
              value={email}
              readOnly={Boolean(user)}
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
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep"
          >
            {t('shop.pay')}
          </button>
        </form>
        <aside className="h-fit rounded-[1.75rem] bg-med p-7 text-white">
          <img
            src={voucher.photoUrl || '/images/station.jpg'}
            alt={voucher.name}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
          <h2 className="mt-6 font-display text-3xl">{t('shop.summary')}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-aqua">{t('common.price')}</dt>
              <dd>{formatMillimes(voucher.publicPrice, i18n.language)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-aqua">{t('shop.quantity')}</dt>
              <dd>{quantity}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-3 text-base">
              <dt>{t('shop.total')}</dt>
              <dd className="font-medium">{formatMillimes(total, i18n.language)}</dd>
            </div>
          </dl>
          {voucher.duration ? (
            <p className="mt-4 text-sm text-white/70">
              {t('common.duration')} · {/^\d+$/.test(voucher.duration) ? `${voucher.duration} min` : voucher.duration}
            </p>
          ) : null}
          <Link to={routes.vouchers} className="mt-6 inline-flex text-sm text-aqua underline-offset-2 hover:underline">
            {t('shop.backCatalogue')}
          </Link>
        </aside>
      </div>
    </section>
  )
}
