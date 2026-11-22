import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterBar } from '../components/common/FilterBar.tsx'
import { PageHero } from '../components/common/PageHero.tsx'
import { TreatmentCard } from '../components/common/TreatmentCard.tsx'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { usePublicTreatments } from '../hooks/usePublicTreatments.ts'
import { treatmentCategories, type TreatmentCategory } from '../types/index.ts'

export function Treatments() {
  const { t } = useTranslation()
  usePageMeta(t('meta.treatments.title'), t('meta.treatments.description'))
  const { status, treatments } = usePublicTreatments()
  const [category, setCategory] = useState<TreatmentCategory>('all')

  const visible = useMemo(
    () => (category === 'all' ? treatments : treatments.filter((treatment) => treatment.category === category)),
    [category, treatments],
  )

  const options = treatmentCategories.map((id) => ({
    id,
    label: t(`treatments.filters.${id}`),
  }))

  return (
    <>
      <PageHero
        eyebrow={t('nav.treatments')}
        title={t('treatments.heroTitle')}
        text={t('treatments.heroText')}
        image="/images/source.jpg"
        imageAlt={t('treatments.heroAlt')}
      />
      <section className="bg-beige py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterBar
              label={t('treatments.heroTitle')}
              options={options}
              value={category}
              onChange={(id) => setCategory(id as TreatmentCategory)}
            />
            <p className="text-sm text-mist">{t('treatments.count', { count: visible.length })}</p>
          </div>
          {status === 'loading' ? <p className="mt-12 text-mist">{t('treatments.loading')}</p> : null}
          {status === 'error' ? <p className="mt-12 text-mist">{t('treatments.loadError')}</p> : null}
          {status === 'ready' && visible.length === 0 ? <p className="mt-12 text-mist">{t('treatments.empty')}</p> : null}
          {status === 'ready' && visible.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
