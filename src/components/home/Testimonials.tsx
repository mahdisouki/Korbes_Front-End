import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useObjectList } from '../../hooks/useObjectList.ts'
import { Reveal } from '../common/Reveal.tsx'
import { SectionTitle } from '../common/SectionTitle.tsx'

type Item = { quote: string; name: string; detail: string }

export function Testimonials() {
  const { t } = useTranslation()
  const items = useObjectList<Item>('home.testimonials.items')

  return (
    <section className="bg-beige py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionTitle
          eyebrow={t('home.testimonials.eyebrow')}
          title={t('home.testimonials.title')}
        />
        <p className="mt-6 max-w-3xl rounded-2xl bg-aqua px-5 py-4 text-sm leading-relaxed text-med">
          {t('home.testimonials.notice')}
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.05}>
              <figure className="lift flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.55)]">
                <Quote className="h-7 w-7 text-turquoise" aria-hidden />
                <blockquote className="mt-4 flex-1 font-display text-2xl leading-snug text-med">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-sand pt-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-turquoise">
                    {t('common.demo')}
                  </span>
                  <span className="mt-1 block font-medium text-ink">{item.name}</span>
                  <span className="text-sm text-mist">{item.detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
