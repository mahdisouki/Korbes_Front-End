import { useTranslation } from 'react-i18next'
import { useObjectList } from '../../hooks/useObjectList.ts'
import { Reveal } from '../common/Reveal.tsx'
import { SectionTitle } from '../common/SectionTitle.tsx'

const images = [
  { src: '/images/rue-02.jpg', altKey: 'gallery.items.rue-haute.alt' },
  { src: '/images/source.jpg', altKey: 'gallery.items.source.alt' },
  { src: '/images/colline.jpg', altKey: 'gallery.items.colline.alt' },
]

type Item = { title: string; text: string }

export function Facilities() {
  const { t } = useTranslation()
  const items = useObjectList<Item>('home.facilities.items')

  return (
    <section className="bg-sand/60 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionTitle eyebrow={t('home.facilities.eyebrow')} title={t('home.facilities.title')} />
        <div className="mt-14 space-y-16">
          {items.map((item, index) => {
            const image = images[index]
            return (
              <Reveal key={item.title}>
                <article className="grid items-center gap-8 lg:grid-cols-2">
                  <div className={`group overflow-hidden rounded-[1.75rem] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={image?.src}
                      alt={image ? t(image.altKey) : ''}
                      className="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <p className="font-display text-5xl text-turquoise/40">0{index + 1}</p>
                    <h3 className="mt-2 font-display text-4xl text-med">{item.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-mist">{item.text}</p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
