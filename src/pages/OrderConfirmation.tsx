import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { VoucherActions } from '../components/account/VoucherActions.tsx'
import { formatDay, formatMillimes, formatWhen } from '../data/format.ts'
import { routes } from '../data/routes.ts'
import { useUser } from '../hooks/useAccount.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicVouchers } from '../hooks/usePublicVouchers.ts'
import { apiJson } from '../lib/api.ts'
import { rememberedOrder, type ApiOrder, type StoredOrder } from '../lib/orders.ts'

export function OrderConfirmation() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation()
  const user = useUser()
  const { vouchers } = usePublicVouchers()
  const [entry, setEntry] = useState<StoredOrder | null>(() => rememberedOrder(id))
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>(user ? 'loading' : entry ? 'ready' : 'missing')
  usePageMeta(
    entry ? t('meta.order.title', { id: entry.order.orderCode }) : t('meta.order.missingTitle'),
    t('meta.order.description'),
  )

  useEffect(() => {
    const cached = rememberedOrder(id)
    if (!user) {
      setEntry(cached)
      setStatus(cached ? 'ready' : 'missing')
      return
    }
    let alive = true
    apiJson<{ data: ApiOrder }>(`/orders/${id}`)
      .then((body) => {
        if (!alive) return
        setEntry({ order: body.data, payment: cached?.payment })
        setStatus('ready')
      })
      .catch(() => {
        if (!alive) return
        setEntry(cached)
        setStatus(cached ? 'ready' : 'missing')
      })
    return () => {
      alive = false
    }
  }, [id, user])

  if (status === 'loading') {
    return (
      <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
        <p className="mx-auto max-w-xl text-sm text-mist">{t('shop.loading')}</p>
      </section>
    )
  }

  if (!entry) {
    return (
      <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-xl">
          <h1 className="font-display text-5xl text-med">{t('shop.orderMissing')}</h1>
          <Link to={routes.guestAccess} className="mt-6 inline-flex text-turquoise-deep underline-offset-2 hover:underline">
            {t('shop.guestAccess')}
          </Link>
        </div>
      </section>
    )
  }

  const order = entry.order
  const line = order.lines[0]
  const name = vouchers.find((item) => item.id === line?.voucherTypeId)?.name || t('shop.voucher')
  const statusKey = `shop.orderStatus.${order.status}`
  const statusLabel = t(statusKey) === statusKey ? order.status : t(statusKey)

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="font-display text-5xl text-med">{t('shop.orderTitle', { id: order.orderCode })}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.orderKeep', { code: order.orderCode })}</p>
        <span className="mt-5 inline-flex rounded-full bg-aqua px-4 py-1.5 text-sm font-medium text-med">{statusLabel}</span>
        {order.paymentMode === 'agency' && order.paymentCode ? (
          <p className="mt-4 leading-relaxed text-ink">{t('shop.agencyPending')}</p>
        ) : null}
        {order.paymentMode === 'sandbox_card' && order.status === 'pending_payment' ? (
          <p className="mt-4 leading-relaxed text-ink">{t('shop.cardPending')}</p>
        ) : null}
        <dl className="mt-8 grid gap-4 rounded-[1.75rem] bg-white p-7 sm:grid-cols-2">
          <Item label={t('shop.voucher')} value={name} />
          <Item label={t('shop.visitDate')} value={line ? formatDay(line.visitDate, i18n.language) : '—'} />
          <Item label={t('shop.beneficiary')} value={line?.beneficiaries.join(', ') || '—'} />
          <Item label={t('shop.quantity')} value={String(line?.quantity ?? order.lines.length)} />
          {order.guestEmail ? <Item label={t('shop.email')} value={order.guestEmail} ltr /> : null}
          <Item label={t('shop.total')} value={formatMillimes(order.total, i18n.language)} />
          <Item label={t('shop.placed')} value={formatWhen(order.createdAt, i18n.language)} />
          {order.paymentCode ? <Item label={t('shop.paymentCode')} value={order.paymentCode} ltr /> : null}
          {entry.payment ? <Item label={t('shop.paymentReference')} value={entry.payment.reference} ltr /> : null}
        </dl>
        <div className="mt-6 space-y-4">
          {order.vouchers.map((voucher) => (
            <article key={voucher.id} className="rounded-[1.75rem] bg-white p-7">
              <p className="text-sm text-mist">{t('shop.voucherNumber')}</p>
              <p className="mt-1 font-display text-3xl text-med" dir="ltr">
                {voucher.publicId}
              </p>
              <p className="mt-2 text-sm text-ink">
                {voucher.beneficiary} · {formatDay(voucher.visitDate, i18n.language)}
              </p>
              <p className="mt-1 text-sm font-medium text-turquoise-deep">{voucherLabel(t, voucher.status)}</p>
              {user ? <VoucherActions voucherId={voucher.id} publicId={voucher.publicId} /> : null}
            </article>
          ))}
        </div>
        <Link to={user ? routes.account : routes.vouchers} className="mt-8 inline-flex text-sm text-turquoise-deep underline-offset-2 hover:underline">
          {user ? t('shop.accountTitle') : t('shop.backCatalogue')}
        </Link>
      </div>
    </section>
  )
}

function voucherLabel(t: (key: string) => string, status: string) {
  const key = `shop.voucherStatus.${status}`
  const label = t(key)
  return label === key ? status : label
}

function Item({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div>
      <dt className="text-sm text-mist">{label}</dt>
      <dd className="mt-1 font-medium text-ink" dir={ltr ? 'ltr' : undefined}>
        {value}
      </dd>
    </div>
  )
}
