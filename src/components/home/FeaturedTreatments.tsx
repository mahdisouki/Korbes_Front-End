import { useTranslation } from 'react-i18next'
import { treatments } from '../../data/treatments.ts'
import { routes } from '../../data/routes.ts'
import { Button } from '../common/Button.tsx'
import { SectionTitle } from '../common/SectionTitle.tsx'
import { TreatmentCard } from '../common/TreatmentCard.tsx'

export function FeaturedTreatments() {
  const { t } = useTranslation()
  const featured = treatments.filter((treatment) => treatment.featured)

  return (
    <section className="bg-beige py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            eyebrow={t('home.featured.eyebrow')}
            title={t('home.featured.title')}
            text={t('home.featured.intro')}
          />
          <Button to={routes.treatments} variant="ghost" className="shrink-0">
            {t('home.featured.all')}
          </Button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map((treatment) => (
            <TreatmentCard key={treatment.slug} treatment={treatment} />
          ))}
        </div>
      </div>
    </section>
  )
}
