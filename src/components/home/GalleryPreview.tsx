import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { routes } from '../../data/routes.ts'
import { Button } from '../common/Button.tsx'
import { SectionTitle } from '../common/SectionTitle.tsx'

const preview = [
  { src: '/images/sunset.jpg', alt: 'gallery.items.sunset.alt', caption: 'gallery.items.sunset.caption', className: 'sm:col-span-2 sm:row-span-2 min-h-80', position: 'center' },
  { src: '/images/crique.jpg', alt: 'gallery.items.crique.alt', caption: 'gallery.items.crique.caption', className: 'min-h-44', position: 'center' },
  { src: '/images/coucher.jpg', alt: 'gallery.items.coucher.alt', caption: 'gallery.items.coucher.caption', className: 'min-h-44', position: 'center' },
  { src: '/images/source.jpg', alt: 'gallery.items.source.alt', caption: 'gallery.items.source.caption', className: 'min-h-44', position: 'center' },
  { src: '/images/ville.jpg', alt: 'gallery.items.ville.alt', caption: 'gallery.items.ville.caption', className: 'min-h-44', position: '70% center' },
]

export function GalleryPreview() {
  const { t } = useTranslation()

  return (
    <section className="bg-beige py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            eyebrow={t('home.gallery.eyebrow')}
            title={t('home.gallery.title')}
            text={t('home.gallery.text')}
          />
          <Button to={routes.gallery} variant="ghost" className="shrink-0">
            {t('home.gallery.cta')}
          </Button>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-4">
          {preview.map((photo) => (
            <Link
              key={photo.src}
              to={routes.gallery}
              className={`group relative block overflow-hidden rounded-[1.5rem] ${photo.className}`}
            >
              <img
                src={photo.src}
                alt={t(photo.alt)}
                style={{ objectPosition: photo.position }}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-med-deep/80 to-transparent p-4 text-sm text-white opacity-100 transition duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                {t(photo.caption)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
