import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatMillimes } from '../data/format.ts'
import { routes, voucherPath } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicVouchers } from '../hooks/usePublicVouchers.ts'

export function VoucherCatalogue() {
  const { t, i18n } = useTranslation()
  const { status, vouchers } = usePublicVouchers()
  usePageMeta(t('meta.vouchers.title'), t('meta.vouchers.description'))

  return (
    <>
      <section className="bg-med px-5 pb-16 pt-32 text-white sm:px-8 sm:pb-20">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">{t('shop.catalogueTitle')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{t('shop.catalogueText')}</p>
        </div>
      </section>
      <section className="bg-beige py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          {status === 'loading' ? <p className="text-sm text-mist">{t('shop.loading')}</p> : null}
          {status === 'error' ? <p className="text-sm text-mist">{t('shop.loadError')}</p> : null}
          {status === 'ready' && vouchers.length === 0 ? <p className="text-sm text-mist">{t('catalog.empty')}</p> : null}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {vouchers.map((voucher) => (
              <article
                key={voucher.id}
                className="lift group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.55)] ring-1 ring-med/5"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                  <img
                    src={voucher.photoUrl || '/images/station.jpg'}
                    alt={voucher.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-3xl text-med">{voucher.name}</h2>
                  {voucher.description ? <p className="mt-3 leading-relaxed text-mist">{voucher.description}</p> : null}
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-sand pt-4 text-sm">
                    <div>
                      <dt className="text-mist">{t('common.price')}</dt>
                      <dd className="mt-1 font-medium text-ink">{formatMillimes(voucher.publicPrice, i18n.language)}</dd>
                    </div>
                    {voucher.duration ? (
                      <div>
                        <dt className="text-mist">{t('common.duration')}</dt>
                        <dd className="mt-1 font-medium text-ink">
                          {/^\d+$/.test(voucher.duration) ? `${voucher.duration} min` : voucher.duration}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <Link
                    to={voucherPath(voucher.slug)}
                    className="mt-5 inline-flex rounded-full bg-turquoise px-5 py-2.5 text-sm font-medium text-white transition hover:bg-turquoise-deep"
                  >
                    {t('shop.buy')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm text-mist">
            <Link to={routes.guestAccess} className="font-medium text-turquoise-deep underline-offset-2 hover:underline">
              {t('shop.guestAccess')}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
