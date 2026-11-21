import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'
import { DemoNote } from '../components/account/DemoNote.tsx'
import { SelectField, TextField } from '../components/account/Fields.tsx'
import { VoucherActions } from '../components/account/VoucherActions.tsx'
import { logoutUser, updateProfile, voucherStatus, voucherStatusKey } from '../data/accountStore.ts'
import { labelForReference } from '../data/catalog.ts'
import { formatDay, formatMoney, formatWhen } from '../data/format.ts'
import { orderPath, routes } from '../data/routes.ts'
import { useLedger, useUser } from '../hooks/useAccount.ts'
import { useCatalog } from '../hooks/useCatalog.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { languages, type LanguageCode } from '../i18n/index.ts'

type Tab = 'profile' | 'orders' | 'vouchers' | 'invoices'

function isLanguage(value: string): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

export function Account() {
  const { t, i18n } = useTranslation()
  const user = useUser()
  const ledger = useLedger()
  const products = useCatalog()
  const [tab, setTab] = useState<Tab>('profile')
  usePageMeta(t('meta.account.title'), t('meta.account.description'))

  if (!user) return <Navigate to={routes.login} replace state={{ from: routes.account }} />

  const orders = ledger.orders.filter((order) => order.userId === user.id)
  const vouchers = ledger.vouchers.filter((voucher) => voucher.userId === user.id)
  const invoices = ledger.invoices.filter((invoice) => invoice.userId === user.id)
  const tabs: Tab[] = ['profile', 'orders', 'vouchers', 'invoices']

  return (
    <section className="bg-beige px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <p className="eyebrow text-turquoise">{t('common.demo')}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl text-med">{t('shop.hello', { name: user.firstName })}</h1>
          <button
            type="button"
            className="rounded-full border border-med/15 px-5 py-2.5 text-sm font-medium text-med transition hover:bg-white"
            onClick={logoutUser}
          >
            {t('nav.logout')}
          </button>
        </div>
        <div className="mt-6">
          <DemoNote>{t('shop.demoBanner')}</DemoNote>
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
          {tab === 'profile' ? <Profile userId={user.id} firstName={user.firstName} lastName={user.lastName} phone={user.phone} language={user.language} /> : null}
          {tab === 'orders' ? (
            orders.length === 0 ? (
              <Empty text={t('shop.emptyOrders')} />
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="rounded-[1.75rem] bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-med" dir="ltr">
                            {order.id}
                          </p>
                          <p className="mt-1 text-ink">{labelForReference(products, order.voucherSlug, i18n.language)}</p>
                          <p className="mt-1 text-sm text-mist">
                            {formatDay(order.visitDate, i18n.language)} · {formatWhen(order.createdAt, i18n.language)}
                          </p>
                        </div>
                        <p className="font-medium text-ink">{formatMoney(order.unitPrice * order.quantity, i18n.language, order.currency)}</p>
                      </div>
                      <Link
                        to={orderPath(order.id)}
                        className="mt-4 inline-flex text-sm text-turquoise-deep underline-offset-2 hover:underline"
                      >
                        {t('shop.viewOrder')}
                      </Link>
                    </li>
                ))}
              </ul>
            )
          ) : null}
          {tab === 'vouchers' ? (
            vouchers.length === 0 ? (
              <Empty text={t('shop.emptyVouchers')} />
            ) : (
              <ul className="space-y-4">
                {vouchers.map((voucher) => (
                  <li key={voucher.id} className="rounded-[1.75rem] bg-white p-6">
                    <p className="text-sm text-mist">{t('shop.voucherNumber')}</p>
                    <p className="mt-1 font-display text-3xl text-med" dir="ltr">
                      {voucher.number}
                    </p>
                    <p className="mt-2 text-sm text-ink">
                      {labelForReference(products, voucher.voucherSlug, i18n.language)} · {formatDay(voucher.visitDate, i18n.language)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-turquoise-deep">{t(voucherStatusKey(voucherStatus(voucher)))}</p>
                    <VoucherActions number={voucher.number} />
                  </li>
                ))}
              </ul>
            )
          ) : null}
          {tab === 'invoices' ? (
            invoices.length === 0 ? (
              <Empty text={t('shop.emptyInvoices')} />
            ) : (
              <ul className="space-y-4">
                {invoices.map((invoice) => (
                  <InvoiceRow key={invoice.id} number={invoice.number} amount={invoice.amount} issuedAt={invoice.issuedAt} />
                ))}
              </ul>
            )
          ) : null}
        </div>
      </div>
    </section>
  )
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

function Profile({
  userId,
  firstName,
  lastName,
  phone,
  language,
}: {
  userId: string
  firstName: string
  lastName: string
  phone: string
  language: LanguageCode
}) {
  const { t, i18n } = useTranslation()
  const [given, setGiven] = useState(firstName)
  const [family, setFamily] = useState(lastName)
  const [tel, setTel] = useState(phone)
  const [lang, setLang] = useState<LanguageCode>(language)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (given.trim().length < 2 || family.trim().length < 2) {
      setError(t('shop.errors.profile'))
      setSaved(false)
      return
    }
    if (tel.replace(/\D/g, '').length < 8) {
      setError(t('shop.errors.phone'))
      setSaved(false)
      return
    }
    updateProfile(userId, { firstName: given, lastName: family, phone: tel, language: lang })
    void i18n.changeLanguage(lang)
    setError('')
    setSaved(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-[1.75rem] bg-white p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="firstName" label={t('shop.firstName')} autoComplete="given-name" value={given} onChange={(event) => setGiven(event.target.value)} />
        <TextField id="lastName" label={t('shop.lastName')} autoComplete="family-name" value={family} onChange={(event) => setFamily(event.target.value)} />
      </div>
      <TextField id="phone" type="tel" dir="ltr" label={t('shop.phone')} autoComplete="tel" value={tel} onChange={(event) => setTel(event.target.value)} />
      <SelectField
        id="language"
        label={t('shop.language')}
        value={lang}
        onChange={(event) => {
          if (isLanguage(event.target.value)) setLang(event.target.value)
        }}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </SelectField>
      {error ? <p className="text-sm text-med">{error}</p> : null}
      <button type="submit" className="rounded-full bg-turquoise px-6 py-3 text-sm font-medium text-white transition hover:bg-turquoise-deep">
        {t('shop.saveProfile')}
      </button>
      {saved ? (
        <p role="status" className="text-sm text-med">
          {t('shop.profileSaved')}
        </p>
      ) : null}
    </form>
  )
}

function InvoiceRow({ number, amount, issuedAt }: { number: string; amount: number; issuedAt: string }) {
  const { t, i18n } = useTranslation()
  const [notice, setNotice] = useState(false)

  return (
    <li className="rounded-[1.75rem] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-med" dir="ltr">
            {number}
          </p>
          <p className="mt-1 text-sm text-mist">{formatWhen(issuedAt, i18n.language)}</p>
        </div>
        <p className="font-medium text-ink">{formatMoney(amount, i18n.language)}</p>
      </div>
      <button
        type="button"
        className="mt-4 rounded-full bg-aqua px-5 py-2.5 text-sm font-medium text-med"
        onClick={() => setNotice(true)}
      >
        {t('shop.downloadPdf')}
      </button>
      {notice ? (
        <p role="status" className="mt-3 text-sm leading-relaxed text-med">
          {t('shop.pdfNotice')}
        </p>
      ) : null}
    </li>
  )
}
