import { ArrowRight, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { routes } from '../../data/routes.ts'
import { useObjectList } from '../../hooks/useObjectList.ts'
import { Button } from '../common/Button.tsx'
import { Reveal } from '../common/Reveal.tsx'

type Fact = { label: string; value: string; note: string }

export function Hero() {
  const { t } = useTranslation()
  const facts = useObjectList<Fact>('home.hero.facts')

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden">
      <img
        src="/images/rue-01.jpg"
        alt={t('home.hero.imageAlt')}
        className="photo-drift absolute inset-0 h-full w-full object-cover object-[62%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-med via-med/70 to-med/10 rtl:bg-gradient-to-l" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 pt-32 sm:px-8">
        <Reveal className="max-w-3xl bg-white p-7 text-med sm:p-10">
          <p className="eyebrow text-mist">{t('home.hero.eyebrow')}</p>
          <h1 className="mt-5 font-display text-[2.8rem] leading-[0.98] text-med sm:text-7xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">{t('home.hero.subtitle')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to={routes.about}>
              {t('home.hero.primary')}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
            </Button>
            <Button to={routes.treatments} variant="ghost">
              {t('home.hero.secondary')}
            </Button>
          </div>
          <dl className="mt-10 grid gap-6 border-t border-sand pt-6 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">{fact.label}</dt>
                <dd className="mt-2 font-display text-3xl text-med" dir="ltr">
                  {fact.value}
                </dd>
                <dd className="text-sm text-mist">{fact.note}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      <a
        href="#introduction"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-xs text-white/80"
      >
        <span>{t('home.hero.scroll')}</span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </a>
    </section>
  )
}
