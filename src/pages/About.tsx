import { useTranslation } from 'react-i18next'
import { PageHero } from '../components/common/PageHero.tsx'
import { Reveal } from '../components/common/Reveal.tsx'
import { useObjectList } from '../hooks/useObjectList.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

type Stat = { label: string; value: string }
type Value = { title: string; text: string }

export function About() {
  const { t } = useTranslation()
  usePageMeta(t('meta.about.title'), t('meta.about.description'))
  const stats = useObjectList<Stat>('about.water.stats')
  const values = useObjectList<Value>('about.values.items')

  return (
    <>
      <PageHero
        eyebrow={t('nav.about')}
        title={t('about.heroTitle')}
        text={t('about.heroText')}
        image="/images/cotes.jpg"
        imageAlt={t('about.heroAlt')}
      />
      <section className="bg-beige py-16 sm:py-24">
        <Reveal className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="font-display text-3xl leading-snug text-med sm:text-4xl">{t('about.lead')}</p>
        </Reveal>

        <div className="mx-auto mt-20 grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-turquoise">{t('about.history.eyebrow')}</p>
            <h2 className="mt-3 font-display text-4xl text-med sm:text-5xl">{t('about.history.title')}</h2>
            <p className="mt-5 leading-relaxed text-ink">{t('about.history.p1')}</p>
            <p className="mt-4 leading-relaxed text-mist">{t('about.history.p2')}</p>
          </Reveal>
          <Reveal>
            <div className="group overflow-hidden rounded-[1.75rem]">
              <img
                src="/images/rue-02.jpg"
                alt={t('about.history.imageAlt')}
                className="aspect-[3/4] w-full object-cover object-[center_30%] transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-20 grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal className="lg:order-2">
            <p className="eyebrow text-turquoise">{t('about.location.eyebrow')}</p>
            <h2 className="mt-3 font-display text-4xl text-med sm:text-5xl">{t('about.location.title')}</h2>
            <p className="mt-5 leading-relaxed text-mist">{t('about.location.p')}</p>
          </Reveal>
          <Reveal className="lg:order-1">
            <div className="group overflow-hidden rounded-[1.75rem]">
              <img
                src="/images/ville.jpg"
                alt={t('about.location.imageAlt')}
                className="aspect-[4/3] w-full object-cover object-[72%_center] transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <p className="eyebrow text-turquoise">{t('about.water.eyebrow')}</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl text-med sm:text-5xl">{t('about.water.title')}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist">{t('about.water.note')}</p>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] bg-beige p-6">
                <dt className="text-sm text-mist">{stat.label}</dt>
                <dd className="mt-2 font-display text-3xl leading-tight text-med" dir="ltr">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-3xl leading-relaxed text-ink">{t('about.water.text')}</p>
        </div>
      </section>

      <section className="bg-beige py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow text-turquoise">{t('about.nature.eyebrow')}</p>
            <h2 className="mt-3 font-display text-4xl text-med sm:text-5xl">{t('about.nature.title')}</h2>
            <p className="mt-5 leading-relaxed text-mist">{t('about.nature.p')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="/images/crique.jpg"
              alt={t('about.nature.imageAlt')}
              className="h-64 w-full rounded-[1.5rem] object-cover sm:h-full"
              loading="lazy"
            />
            <img
              src="/images/falaise.jpg"
              alt={t('about.nature.secondAlt')}
              className="h-64 w-full rounded-[1.5rem] object-cover sm:h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-med py-16 text-white sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <p className="eyebrow text-aqua">{t('about.values.eyebrow')}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{t('about.values.title')}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="rounded-[1.5rem] bg-white/10 p-6 ring-1 ring-white/10">
                <h3 className="font-display text-2xl">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
