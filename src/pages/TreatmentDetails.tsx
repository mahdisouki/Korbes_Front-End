import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button.tsx'
import { formatMillimes } from '../data/format.ts'
import { routes, treatmentPath } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicTreatments } from '../hooks/usePublicTreatments.ts'

export function TreatmentDetails() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const { status, treatments } = usePublicTreatments()
  const treatment = treatments.find((item) => item.slug === slug) ?? null
  const name = treatment?.name || t('treatments.notFoundTitle')
  usePageMeta(t('meta.treatment.title', { name }), t('meta.treatment.description', { name }))

  if (status === 'loading') {
    return (
      <section className="bg-beige px-5 py-40 text-center">
        <p className="text-mist">{t('treatments.loading')}</p>
      </section>
    )
  }

  if (status === 'error' || !treatment) {
    return (
      <section className="bg-beige px-5 py-40 text-center">
        <h1 className="font-display text-5xl text-med">
          {status === 'error' ? t('treatments.loadError') : t('treatments.notFoundTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mist">{t('treatments.notFoundText')}</p>
        <Button to={routes.treatments} className="mt-8">
          {t('common.backTreatments')}
        </Button>
      </section>
    )
  }

  const others = treatments.filter((item) => item.slug !== treatment.slug).slice(0, 3)

  return (
    <>
      <section className="relative isolate min-h-[70vh]">
        <img
          src={treatment.photoUrl || '/images/station.jpg'}
          alt={treatment.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-med-deep via-med-deep/40 to-med/20" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-36 sm:px-8">
          <h1 className="mt-4 max-w-3xl font-display text-5xl text-white sm:text-6xl">{treatment.name}</h1>
          {treatment.summary ? <p className="mt-4 max-w-2xl text-lg text-white/85">{treatment.summary}</p> : null}
        </div>
      </section>
      <section className="bg-beige py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            {treatment.description ? <p className="text-lg leading-relaxed text-ink">{treatment.description}</p> : null}
            {treatment.benefits.length > 0 ? (
              <>
                <h2 className="mt-12 font-display text-3xl text-med">{t('treatments.benefitsTitle')}</h2>
                <ul className="mt-5 space-y-3">
                  {treatment.benefits.map((item) => (
                    <li key={item} className="rounded-2xl bg-white px-5 py-4 text-ink shadow-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {treatment.characteristics.length > 0 ? (
              <>
                <h2 className="mt-12 font-display text-3xl text-med">{t('treatments.characteristicsTitle')}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                  {treatment.characteristics.map((item) => (
                    <li key={item} className="rounded-2xl bg-aqua px-4 py-4 text-sm text-med">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {treatment.info ? (
              <>
                <h2 className="mt-12 font-display text-3xl text-med">{t('treatments.infoTitle')}</h2>
                <p className="mt-4 leading-relaxed text-mist">{treatment.info}</p>
              </>
            ) : null}
          </div>
          <aside className="h-fit rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.55)] lg:sticky lg:top-28">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-mist">{t('common.duration')}</dt>
                <dd className="mt-1 text-xl text-med">{treatment.duration}</dd>
              </div>
              <div>
                <dt className="text-sm text-mist">{t('common.price')}</dt>
                <dd className="mt-1 text-xl text-med">
                  {treatment.publicPrice == null ? '—' : formatMillimes(treatment.publicPrice, i18n.language)}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-mist">{t('treatments.disclaimer')}</p>
            <Button to={routes.contact} className="mt-6 w-full">
              {t('treatments.cta')}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
            </Button>
            <Link to={routes.treatments} className="mt-4 block text-center text-sm text-turquoise">
              {t('common.backTreatments')}
            </Link>
          </aside>
        </div>
        {others.length > 0 ? (
          <div className="mx-auto mt-16 w-full max-w-6xl px-5 sm:px-8">
            <h2 className="font-display text-3xl text-med">{t('home.featured.all')}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.id}
                  to={treatmentPath(item.slug)}
                  className="rounded-2xl bg-white p-5 ring-1 ring-med/5 transition hover:bg-aqua"
                >
                  <span className="font-display text-2xl text-med">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
