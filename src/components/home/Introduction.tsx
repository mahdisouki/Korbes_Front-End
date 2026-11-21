import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { routes } from '../../data/routes.ts'
import { Reveal } from '../common/Reveal.tsx'

export function Introduction() {
  const { t } = useTranslation()

  return (
    <section id="introduction" className="scroll-mt-24 bg-beige py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal className="relative pb-8">
          <div className="group overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-40px_rgba(12, 30, 124),0.7)]">
            <img
              src="/images/station.jpg"
              alt={t('gallery.items.station.alt')}
              className="aspect-[4/5] w-full object-cover object-[center_18%] transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <img
            src="/images/crique.jpg"
            alt={t('gallery.items.crique.alt')}
            className="absolute -bottom-6 end-4 hidden w-36 rounded-3xl object-cover shadow-[0_20px_40px_-24px_rgba(12, 30, 124),0.7)] ring-4 ring-beige sm:block sm:aspect-square"
            loading="lazy"
          />
          <div className="absolute bottom-6 start-6 max-w-[14rem] rounded-3xl bg-white/95 p-5 shadow-[0_20px_40px_-24px_rgba(12, 30, 124),0.6)] backdrop-blur">
            <p className="font-display text-4xl text-med" dir="ltr">
              {t('home.intro.statValue')}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-mist">{t('home.intro.statLabel')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow text-turquoise">{t('home.intro.eyebrow')}</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.1] text-med sm:text-5xl">
            {t('home.intro.title')}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink">{t('home.intro.p1')}</p>
          <p className="mt-4 leading-relaxed text-mist">{t('home.intro.p2')}</p>
          <Link
            to={routes.about}
            className="mt-8 inline-flex items-center gap-2 font-medium text-turquoise"
          >
            {t('home.intro.link')}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
