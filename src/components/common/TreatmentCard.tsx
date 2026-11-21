import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { treatmentPath } from '../../data/routes.ts'
import type { Treatment } from '../../types/index.ts'

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const { t } = useTranslation()
  const base = `treatments.items.${treatment.slug}`

  return (
    <article className="lift group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.55)] ring-1 ring-med/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={treatment.image}
          alt={t(`gallery.items.${treatment.imageId}.alt`)}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute start-4 top-4 rounded-full bg-beige/95 px-3 py-1 text-xs font-medium text-med">
          {t('common.demo')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-3xl leading-tight text-med">{t(`${base}.name`)}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-mist">{t(`${base}.summary`)}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-sand pt-4 text-sm">
          <div>
            <dt className="text-mist">{t('common.duration')}</dt>
            <dd className="mt-1 font-medium text-ink" dir="ltr">
              {t(`${base}.duration`)}
            </dd>
          </div>
          <div>
            <dt className="text-mist">{t('common.price')}</dt>
            <dd className="mt-1 font-medium text-ink">{t(`${base}.price`)}</dd>
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
