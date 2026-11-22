import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TextField } from '../components/account/Fields.tsx'
import { VisitCalendar, type DayAvailability } from '../components/shop/VisitCalendar.tsx'
import { formatMillimes, todayIso } from '../data/format.ts'
import { orderPath, routes } from '../data/routes.ts'
import { useUser } from '../hooks/useAccount.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicVouchers } from '../hooks/usePublicVouchers.ts'
import { ApiError, apiJson, apiLocale, idempotencyKey } from '../lib/api.ts'
import { rememberOrder, type ApiOrder } from '../lib/orders.ts'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function VoucherPurchase() {
  const { slug = '' } = useParams()
  const { status, vouchers } = usePublicVouchers()
  const voucher = vouchers.find((item) => item.slug.toLowerCase() === slug.trim().toLowerCase()) ?? null
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const user = useUser()
  const [today] = useState(todayIso)
  const [month, setMonth] = useState(today.slice(0, 7))
  const [days, setDays] = useState<DayAvailability[]>([])
  const [calendarStatus, setCalendarStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [visitDate, setVisitDate] = useState('')
  const [beneficiary, setBeneficiary] = useState(user ? `${user.firstName} ${user.lastName}`.trim() : '')
  const [quantity, setQuantity] = useState('1')
  const [email, setEmail] = useState(user?.email ?? '')
  const [paymentMode, setPaymentMode] = useState<'sandbox_card' | 'agency'>('sandbox_card')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  usePageMeta(
    voucher ? t('meta.purchase.title', { name: voucher.name }) : t('meta.vouchers.title'),
    t('meta.purchase.description'),
  )

  useEffect(() => {
    if (!voucher) return
    let alive = true
    setCalendarStatus('loading')
    apiJson<{ data: DayAvailability[] }>(
      `/vouchers/${voucher.id}/availability?month=${month}`,
      { headers: { 'Accept-Language': apiLocale(i18n.language) } },
    )
      .then((body) => {
        if (!alive) return
        setDays(Array.isArray(body.data) ? body.data : [])
        setCalendarStatus('ready')
      })
      .catch(() => {
        if (!alive) return
        setDays([])
        setCalendarStatus('error')
      })
    return () => {
      alive = false
    }
  }, [voucher, month, i18n.language])

  const selected = days.find((day) => day.day === visitDate) ?? null
  const maxQuantity = selected?.remaining == null ? 10 : Math.max(0, selected.remaining)

  useEffect(() => {
    if (!selected?.available) return
    setQuantity((current) => {
      const count = Number(current)
      if (!Number.isInteger(count) || count < 1) return '1'
      if (count > maxQuantity) return String(Math.max(1, maxQuantity))
      return current
    })
  }, [selected, maxQuantity])

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
  const quantityChoices = Array.from({ length: Math.min(maxQuantity, 10) }, (_, index) => String(index + 1))

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!selected?.available) next.visitDate = t('shop.errors.date')
    if (beneficiary.trim().length < 2) next.beneficiary = t('shop.errors.beneficiary')
    if (!Number.isInteger(count) || count < 1 || count > maxQuantity) next.quantity = t('shop.errors.quantity')
    if (!user && !emailPattern.test(email.trim())) next.email = t('shop.errors.email')
    setErrors(next)
    if (Object.keys(next).length > 0) {
      document.getElementById(Object.keys(next)[0] ?? '')?.focus()
      return
    }
    setSubmitting(true)
    try {
      const names = Array.from({ length: count }, () => ({
        name: beneficiary.trim(),
        visitDate,
      }))
      const created = await apiJson<{ data: ApiOrder }>('/orders', {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey(),
          'Accept-Language': apiLocale(i18n.language),
        },
        body: JSON.stringify({
          paymentMode,
          language: apiLocale(i18n.language),
          ...(user ? {} : { guestEmail: email.trim().toLowerCase() }),
          lines: [{ voucherTypeId: voucher.id, beneficiaries: names }],
        }),
      })
      let payment: { reference: string; status: string; amount: number } | undefined
      if (paymentMode === 'sandbox_card') {
        try {
          const paid = await apiJson<{ data: { reference: string; status: string; amount: number } }>(
            `/orders/${created.data.id}/payments`,
            {
              method: 'POST',
              headers: { 'Idempotency-Key': idempotencyKey() },
              body: JSON.stringify(user ? {} : { email: email.trim().toLowerCase() }),
            },
          )
          payment = paid.data
        } catch {
          rememberOrder({ order: created.data })
          navigate(orderPath(created.data.id))
          return
        }
      }
      rememberOrder({ order: created.data, payment })
      navigate(orderPath(created.data.id))
    } catch (err) {
      const code = err instanceof ApiError ? err.code : ''
      if (code === 'sold_out') setErrors({ visitDate: t('shop.errors.soldOut') })
      else if (code === 'day_blocked') setErrors({ visitDate: t('shop.errors.dayBlocked') })
      else setErrors({ form: err instanceof ApiError ? err.message : t('shop.errors.order') })
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={(event) => {
            void onSubmit(event)
          }}
          noValidate
          className="rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12,30,124,0.45)] sm:p-9"
        >
          <h1 className="font-display text-5xl text-med">{voucher.name}</h1>
          {voucher.description ? <p className="mt-4 leading-relaxed text-mist">{voucher.description}</p> : null}
          {voucher.conditions ? (
            <div className="mt-4">
              <h2 className="text-sm font-medium text-med">{t('catalog.fields.conditions')}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-mist">{voucher.conditions}</p>
            </div>
          ) : null}
          <p className="mt-6 text-sm leading-relaxed text-mist">{t('shop.payNote')}</p>
          <div className="mt-6">
            <p className="text-sm font-medium text-ink">{t('shop.visitDate')}</p>
            <div className="mt-3">
              <VisitCalendar
                month={month}
                today={today}
                days={days}
                status={calendarStatus}
                selected={visitDate}
                error={errors.visitDate}
                onMonth={(next) => {
                  setMonth(next)
                  setVisitDate('')
                }}
                onSelect={(day) => {
                  setVisitDate(day)
                  setErrors((current) => ({ ...current, visitDate: '' }))
                }}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="quantity" className="text-sm font-medium text-ink">
                {t('shop.quantity')}
              </label>
              <select
                id="quantity"
                className="mt-2 w-full rounded-2xl border border-transparent bg-beige px-4 py-3 text-ink outline-none focus:border-turquoise"
                value={quantityChoices.includes(quantity) ? quantity : quantityChoices[0] || '1'}
                disabled={quantityChoices.length === 0}
                onChange={(event) => setQuantity(event.target.value)}
              >
                {quantityChoices.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {selected ? (
                <p className="mt-2 text-sm text-mist">
                  {selected.remaining == null ? t('shop.unlimited') : t('shop.remaining', { count: selected.remaining })}
                </p>
              ) : null}
              {errors.quantity ? <p className="mt-2 text-sm text-med">{errors.quantity}</p> : null}
            </div>
            <TextField
              id="beneficiary"
              label={t('shop.beneficiary')}
              autoComplete="name"
              value={beneficiary}
              error={errors.beneficiary}
              onChange={(event) => setBeneficiary(event.target.value)}
            />
            {user ? null : (
              <TextField
                id="email"
                className="sm:col-span-2"
                type="email"
                dir="ltr"
                label={t('shop.email')}
                autoComplete="email"
                value={email}
                error={errors.email}
                onChange={(event) => setEmail(event.target.value)}
              />
            )}
          </div>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-ink">{t('shop.payment')}</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {(['sandbox_card', 'agency'] as const).map((mode) => (
                <label
                  key={mode}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm ${
                    paymentMode === mode ? 'bg-med text-white' : 'bg-beige text-med'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    className="sr-only"
                    checked={paymentMode === mode}
                    onChange={() => setPaymentMode(mode)}
                  />
                  {mode === 'sandbox_card' ? t('shop.paymentCard') : t('shop.paymentAgency')}
                </label>
              ))}
            </div>
          </fieldset>
          {errors.form ? <p className="mt-4 text-sm text-med">{errors.form}</p> : null}
          <button
            type="submit"
            disabled={submitting || calendarStatus !== 'ready'}
            className="mt-6 w-full rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep disabled:opacity-60"
          >
            {submitting ? t('shop.submitting') : t('shop.pay')}
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
          <p className="mt-4 text-sm leading-relaxed text-white/70">{t('shop.estimateNote')}</p>
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
