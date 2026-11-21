import { useTranslation } from 'react-i18next'
import { useObjectList } from '../../hooks/useObjectList.ts'
import { Reveal } from '../common/Reveal.tsx'

type Item = { title: string; text: string }

export function WhyKorbous() {
  const { t } = useTranslation()
  const items = useObjectList<Item>('home.why.items')

  return (
    <section className="relative isolate overflow-hidden py-20 text-white sm:py-28">
      <img
        src="/images/sunset.jpg"
        alt={t('home.why.imageAlt')}
        className="photo-drift absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-med-deep/80 via-med-deep/55 to-med-deep/25" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="eyebrow text-aqua">{t('home.why.eyebrow')}</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
          {t('home.why.title')}
        </h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="h-full rounded-[1.75rem] bg-white/10 p-7 ring-1 ring-white/15 backdrop-blur-sm">
                <p className="font-display text-4xl text-aqua">0{index + 1}</p>
                <h3 className="mt-4 font-display text-3xl">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-white/80">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
