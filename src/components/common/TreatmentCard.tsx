import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatMillimes } from '../../data/format.ts'
import { treatmentPath } from '../../data/routes.ts'
import type { PublicTreatment } from '../../hooks/usePublicTreatments.ts'

export function TreatmentCard({ treatment }: { treatment: PublicTreatment }) {
  const { t, i18n } = useTranslation()

  return (
    <article className="lift group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.55)] ring-1 ring-med/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={treatment.photoUrl || '/images/station.jpg'}
          alt={treatment.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-3xl leading-tight text-med">{treatment.name}</h3>
        {treatment.summary ? <p className="mt-3 flex-1 leading-relaxed text-mist">{treatment.summary}</p> : <span className="flex-1" />}
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-sand pt-4 text-sm">
          <div>
            <dt className="text-mist">{t('common.duration')}</dt>
            <dd className="mt-1 font-medium text-ink">{treatment.duration}</dd>
          </div>
          <div>
            <dt className="text-mist">{t('common.price')}</dt>
            <dd className="mt-1 font-medium text-ink">
              {treatment.publicPrice == null ? '—' : formatMillimes(treatment.publicPrice, i18n.language)}
            </dd>
          </div>
        </dl>
        <Link
          to={treatmentPath(treatment.slug)}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-turquoise transition hover:text-turquoise-deep"
        >
          {t('common.discover')}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
