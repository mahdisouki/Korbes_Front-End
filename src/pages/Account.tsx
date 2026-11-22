import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'
import { VoucherActions } from '../components/account/VoucherActions.tsx'
import { formatDay, formatMillimes, formatWhen } from '../data/format.ts'
import { orderPath, routes } from '../data/routes.ts'
import { logout, useUser } from '../hooks/useAccount.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicVouchers } from '../hooks/usePublicVouchers.ts'
import { ApiError, apiBlob, apiJson, saveBlob } from '../lib/api.ts'
import type { ApiIssuedVoucher, ApiOrder } from '../lib/orders.ts'

type Tab = 'profile' | 'orders' | 'vouchers' | 'invoices'

interface ApiInvoice {
  _id?: string
  id?: string
  number: string
  total: number
  createdAt: string
}

export function Account() {
  const { t, i18n } = useTranslation()
  const user = useUser()
  const { vouchers: catalogue } = usePublicVouchers()
  const [tab, setTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [issued, setIssued] = useState<ApiIssuedVoucher[]>([])
  const [invoices, setInvoices] = useState<ApiInvoice[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  usePageMeta(t('meta.account.title'), t('meta.account.description'))

  useEffect(() => {
    if (!user) return
    let alive = true
    Promise.all([
      apiJson<{ data: ApiOrder[] }>('/orders'),
      apiJson<{ data: ApiIssuedVoucher[] }>('/me/vouchers'),
      apiJson<{ data: ApiInvoice[] }>('/me/invoices'),
    ])
      .then(([orderBody, voucherBody, invoiceBody]) => {
        if (!alive) return
        setOrders(orderBody.data || [])
        setIssued(voucherBody.data || [])
        setInvoices(invoiceBody.data || [])
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [user])

  if (!user) return <Navigate to={routes.login} replace state={{ from: routes.account }} />

  const tabs: Tab[] = ['profile', 'orders', 'vouchers', 'invoices']

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl text-med">{t('shop.hello', { name: user.firstName || user.email })}</h1>
          <button
            type="button"
            className="rounded-full border border-med/15 px-5 py-2.5 text-sm font-medium text-med transition hover:bg-white"
            onClick={() => {
              void logout()
            }}
          >
            {t('nav.logout')}
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={t('shop.accountTitle')}>
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === item ? 'bg-med text-white' : 'bg-white text-med hover:bg-aqua'
              }`}
              onClick={() => setTab(item)}
            >
              {t(`shop.tabs.${item}`)}
            </button>
          ))}
        </div>
        <div className="mt-6" role="tabpanel">
          {status === 'loading' && tab !== 'profile' ? <p className="text-sm text-mist">{t('shop.accountLoading')}</p> : null}
          {status === 'error' && tab !== 'profile' ? <p className="text-sm text-med">{t('shop.accountError')}</p> : null}
          {tab === 'profile' ? (
            <dl className="grid gap-4 rounded-[1.75rem] bg-white p-7 sm:grid-cols-2">
              <Item label={t('shop.firstName')} value={user.firstName || '—'} />
              <Item label={t('shop.lastName')} value={user.lastName || '—'} />
              <Item label={t('shop.email')} value={user.email} ltr />
              <Item label={t('shop.language')} value={user.language} ltr />
            </dl>
          ) : null}
          {tab === 'orders' && status === 'ready' ? (
            orders.length === 0 ? (
              <Empty text={t('shop.emptyOrders')} />
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => {
                  const line = order.lines[0]
                  const name = catalogue.find((item) => item.id === line?.voucherTypeId)?.name || t('shop.voucher')
                  return (
                    <li key={order.id} className="rounded-[1.75rem] bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-med" dir="ltr">
                            {order.orderCode}
                          </p>
                          <p className="mt-1 text-ink">{name}</p>
                          <p className="mt-1 text-sm text-mist">
                            {line ? formatDay(line.visitDate, i18n.language) : '—'} · {formatWhen(order.createdAt, i18n.language)}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="font-medium text-ink">{formatMillimes(order.total, i18n.language)}</p>
                          <p className="mt-1 text-sm text-mist">{labelFor(t, 'shop.orderStatus', order.status)}</p>
                        </div>
                      </div>
                      <Link
                        to={orderPath(order.id)}
                        className="mt-4 inline-flex text-sm text-turquoise-deep underline-offset-2 hover:underline"
                      >
                        {t('shop.viewOrder')}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )
          ) : null}
          {tab === 'vouchers' && status === 'ready' ? (
            issued.length === 0 ? (
              <Empty text={t('shop.emptyVouchers')} />
            ) : (
              <ul className="space-y-4">
                {issued.map((voucher) => (
                  <li key={voucher.id} className="rounded-[1.75rem] bg-white p-6">
                    <p className="text-sm text-mist">{t('shop.voucherNumber')}</p>
                    <p className="mt-1 font-display text-3xl text-med" dir="ltr">
                      {voucher.publicId}
                    </p>
                    <p className="mt-2 text-sm text-ink">
                      {(catalogue.find((item) => item.id === voucher.voucherTypeId)?.name || t('shop.voucher'))} · {formatDay(voucher.visitDate, i18n.language)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-turquoise-deep">{labelFor(t, 'shop.voucherStatus', voucher.status)}</p>
                    <VoucherActions voucherId={voucher.id} publicId={voucher.publicId} />
                  </li>
                ))}
              </ul>
            )
          ) : null}
          {tab === 'invoices' && status === 'ready' ? (
            invoices.length === 0 ? (
              <Empty text={t('shop.emptyInvoices')} />
            ) : (
              <ul className="space-y-4">
                {invoices.map((invoice) => (
                  <InvoiceRow key={invoice.id || invoice._id} invoice={invoice} />
                ))}
              </ul>
            )
          ) : null}
        </div>
      </div>
    </section>
  )
}

function labelFor(t: (key: string) => string, prefix: string, status: string) {
  const key = `${prefix}.${status}`
  const label = t(key)
  return label === key ? status : label
}

function Empty({ text }: { text: string }) {
  const { t } = useTranslation()
  return (
    <div className="rounded-[1.75rem] bg-white p-7">
      <p className="text-mist">{text}</p>
      <Link to={routes.vouchers} className="mt-4 inline-flex text-sm font-medium text-turquoise-deep underline-offset-2 hover:underline">
        {t('shop.backCatalogue')}
      </Link>
    </div>
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

function InvoiceRow({ invoice }: { invoice: ApiInvoice }) {
  const { t, i18n } = useTranslation()
  const [notice, setNotice] = useState('')
  const id = String(invoice.id || invoice._id || '')

  return (
    <li className="rounded-[1.75rem] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-med" dir="ltr">
            {invoice.number}
          </p>
          <p className="mt-1 text-sm text-mist">{formatWhen(invoice.createdAt, i18n.language)}</p>
        </div>
        <p className="font-medium text-ink">{formatMillimes(invoice.total, i18n.language)}</p>
      </div>
      <button
        type="button"
        className="mt-4 rounded-full bg-aqua px-5 py-2.5 text-sm font-medium text-med"
        onClick={() => {
          void apiBlob(`/invoices/${id}/pdf`)
            .then((blob) => saveBlob(blob, `${invoice.number}.pdf`))
            .catch((err: unknown) => {
              setNotice(err instanceof ApiError && err.code === 'pdf_not_ready' ? t('shop.pdfMissing') : t('shop.errors.order'))
            })
        }}
      >
        {t('shop.downloadPdf')}
      </button>
      {notice ? <p className="mt-3 text-sm text-med">{notice}</p> : null}
    </li>
  )
}
