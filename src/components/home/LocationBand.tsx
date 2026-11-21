import { useTranslation } from 'react-i18next'
import { routes } from '../../data/routes.ts'
import { site } from '../../data/site.ts'
import { Button } from '../common/Button.tsx'

export function LocationBand() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-turquoise">{t('home.location.eyebrow')}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-med sm:text-5xl">
            {t('home.location.title')}
          </h2>
          <p className="mt-5 leading-relaxed text-mist">{t('home.location.text')}</p>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-sm text-mist">{t('home.location.addressLabel')}</dt>
              <dd className="mt-1 text-lg text-ink">{t('home.location.address')}</dd>
            </div>
            <div>
              <dt className="text-sm text-mist">{t('home.location.hoursLabel')}</dt>
              <dd className="mt-1 text-lg text-ink">{t('home.location.hours')}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to={routes.contact}>{t('home.location.cta')}</Button>
            <Button to={routes.practical} variant="ghost">
              {t('home.location.info')}
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.55)] ring-1 ring-med/10">
          <iframe
            title={t('home.location.mapLabel')}
            src={site.mapEmbed}
            className="h-80 w-full border-0 lg:h-[28rem]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
