import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { VoucherActions } from '../components/account/VoucherActions.tsx'
import { orderStatus, voucherStatus, voucherStatusKey } from '../data/accountStore.ts'
import { labelForReference } from '../data/catalog.ts'
import { formatDay, formatMoney, formatWhen } from '../data/format.ts'
import { routes } from '../data/routes.ts'
import { useLedger } from '../hooks/useAccount.ts'
import { useCatalog } from '../hooks/useCatalog.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function OrderConfirmation() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation()
  const ledger = useLedger()
  const products = useCatalog()
  const order = ledger.orders.find((item) => item.id.toLowerCase() === id.trim().toLowerCase())
  usePageMeta(
    order ? t('meta.order.title', { id: order.id }) : t('meta.order.missingTitle'),
    t('meta.order.description'),
  )

  if (!order) {
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

  const issued = ledger.vouchers.filter((voucher) => voucher.orderId === order.id)
  const invoice = ledger.invoices.find((item) => item.orderId === order.id)
  const name = labelForReference(products, order.voucherSlug, i18n.language)

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="eyebrow text-turquoise">{t('common.demo')}</p>
        <h1 className="mt-3 font-display text-5xl text-med">{t('shop.orderTitle', { id: order.id })}</h1>
        <p className="mt-4 leading-relaxed text-mist">{t('shop.orderKeep')}</p>
        <span className="mt-5 inline-flex rounded-full bg-aqua px-4 py-1.5 text-sm font-medium text-med">
          {orderStatus(order) === 'cancelled'
            ? t('shop.orderCancelled')
            : orderStatus(order) === 'refunded'
              ? t('shop.orderRefunded')
              : t('shop.paid')}
        </span>
        <dl className="mt-8 grid gap-4 rounded-[1.75rem] bg-white p-7 sm:grid-cols-2">
          <Item label={t('shop.voucher')} value={name} />
          <Item label={t('shop.visitDate')} value={formatDay(order.visitDate, i18n.language)} />
          <Item label={t('shop.beneficiary')} value={order.beneficiary} />
          <Item label={t('shop.quantity')} value={String(order.quantity)} />
          <Item label={t('shop.email')} value={order.email} ltr />
          <Item label={t('shop.total')} value={formatMoney(order.unitPrice * order.quantity, i18n.language, order.currency)} />
          <Item label={t('shop.placed')} value={formatWhen(order.createdAt, i18n.language)} />
          {invoice ? <Item label={t('shop.invoiceNumber')} value={invoice.number} ltr /> : null}
        </dl>
        <div className="mt-6 space-y-4">
          {issued.map((voucher) => (
            <article key={voucher.id} className="rounded-[1.75rem] bg-white p-7">
              <p className="text-sm text-mist">{t('shop.voucherNumber')}</p>
              <p className="mt-1 font-display text-3xl text-med" dir="ltr">
                {voucher.number}
              </p>
              <p className="mt-2 text-sm font-medium text-turquoise-deep">{t(voucherStatusKey(voucherStatus(voucher)))}</p>
              <VoucherActions number={voucher.number} />
            </article>
          ))}
        </div>
        <Link to={routes.vouchers} className="mt-8 inline-flex text-sm text-turquoise-deep underline-offset-2 hover:underline">
          {t('shop.backCatalogue')}
        </Link>
      </div>
    </section>
  )
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
