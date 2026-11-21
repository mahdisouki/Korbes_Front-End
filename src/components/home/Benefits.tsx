import { Droplets, Gem, Stethoscope, Waves } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useObjectList } from '../../hooks/useObjectList.ts'
import { Reveal } from '../common/Reveal.tsx'
import { SectionTitle } from '../common/SectionTitle.tsx'

const icons = [Droplets, Gem, Waves, Stethoscope]

type Item = { title: string; text: string }

export function Benefits() {
  const { t } = useTranslation()
  const items = useObjectList<Item>('home.benefits.items')

  return (
    <section className="bg-med py-20 text-white sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionTitle
          light
          eyebrow={t('home.benefits.eyebrow')}
          title={t('home.benefits.title')}
          text={t('home.benefits.intro')}
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((item, index) => {
            const Icon = icons[index] ?? Droplets
            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="lift h-full rounded-[1.75rem] bg-white/10 p-7 ring-1 ring-white/20 backdrop-blur-sm hover:bg-white/15">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-aqua text-med">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-3xl">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/75">{item.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
