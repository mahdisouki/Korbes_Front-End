import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { creditFor } from '../data/credits.ts'
import { galleryCategories, galleryItems } from '../data/gallery.ts'
import { useLockBody } from '../hooks/useLockBody.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import type { GalleryCategory, GalleryItem } from '../types/index.ts'

const focus: Record<string, string> = {
  rue: '62% center',
  ville: '72% center',
  station: 'center 18%',
  'rue-haute': 'center 30%',
  source: 'center 55%',
  sunset: 'center 42%',
}

export function Gallery() {
  const { t } = useTranslation()
  usePageMeta(t('meta.gallery.title'), t('meta.gallery.description'))
  const [category, setCategory] = useState<GalleryCategory>('all')
  const [activeId, setActiveId] = useState<string | null>(null)

  const visible = useMemo(
    () =>
      category === 'all'
        ? galleryItems
        : galleryItems.filter((item) => item.categories.includes(category)),
    [category],
  )

  const activeIndex = visible.findIndex((item) => item.id === activeId)
  const active = activeIndex >= 0 ? visible[activeIndex] : null

  const counts = useMemo(() => {
    const tally = Object.fromEntries(galleryCategories.map((id) => [id, 0])) as Record<GalleryCategory, number>
    tally.all = galleryItems.length
    for (const item of galleryItems) {
      for (const id of item.categories) tally[id] += 1
    }
    return tally
  }, [])

  return (
    <>
      <section className="relative isolate flex min-h-[46vh] items-end overflow-hidden">
        <img
          src="/images/sunset.jpg"
          alt={t('gallery.heroAlt')}
          className="photo-drift absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-med-deep via-med-deep/50 to-med-deep/15" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8">
          <p className="eyebrow text-aqua">{t('nav.gallery')}</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] text-white sm:text-6xl">
            {t('gallery.heroTitle')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{t('gallery.heroText')}</p>
        </div>
      </section>

      <div className="sticky top-20 z-30 border-b border-sand/80 bg-beige/90 backdrop-blur">
        <div
          role="toolbar"
          aria-label={t('gallery.heroTitle')}
          className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-5 py-3 sm:px-8"
        >
          {galleryCategories.map((id) => {
            const selected = id === category
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  selected ? 'bg-med text-white' : 'bg-white text-med ring-1 ring-med/10 hover:bg-aqua'
                }`}
              >
                {t(`gallery.filters.${id}`)}
                <span className={selected ? 'text-white/70' : 'text-mist'} dir="ltr">
                  {counts[id]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <section className="bg-beige py-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          {visible.length === 0 ? (
            <p className="py-16 text-mist">{t('gallery.empty')}</p>
          ) : (
            <div className="grid grid-flow-dense grid-cols-2 gap-3 lg:grid-cols-4">
              {visible.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`group relative overflow-hidden rounded-[1.35rem] bg-med text-start shadow-[0_18px_40px_-28px_rgba(12, 30, 124),0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise ${
                    item.wide ? 'col-span-2 aspect-[16/10]' : 'aspect-[3/4]'
                  }`}
                  aria-label={`${t('gallery.open')} — ${t(`gallery.items.${item.id}.caption`)}`}
                >
                  <img
                    src={item.src}
                    alt={t(`gallery.items.${item.id}.alt`)}
                    style={{ objectPosition: focus[item.id] ?? 'center' }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute start-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-med" dir="ltr">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-med-deep/80 to-transparent sm:opacity-0 sm:transition sm:duration-300 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-sm leading-snug text-white sm:translate-y-3 sm:opacity-0 sm:transition sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100">
                    {t(`gallery.items.${item.id}.caption`)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {active ? (
          <Lightbox
            items={visible}
            index={activeIndex}
            onClose={() => setActiveId(null)}
            onSelect={setActiveId}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}

function Lightbox({
  items,
  index,
  onClose,
  onSelect,
}: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const { t } = useTranslation()
  const item = items[index]
  const credit = item ? creditFor(item.src) : undefined
  useLockBody(true)

  const step = (direction: number) => {
    const next = items[(index + direction + items.length) % items.length]
    if (next) onSelect(next.id)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') {
        const next = items[(index + 1) % items.length]
        if (next) onSelect(next.id)
      }
      if (event.key === 'ArrowLeft') {
        const next = items[(index - 1 + items.length) % items.length]
        if (next) onSelect(next.id)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, items, onClose, onSelect])

  if (!item) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-med-deep/96 text-white"
      role="dialog"
      aria-modal="true"
      aria-label={t(`gallery.items.${item.id}.caption`)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="text-sm tracking-[0.18em] text-white/70" dir="ltr">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white hover:text-med"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute start-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-med shadow-lg sm:start-6"
          aria-label={t('gallery.prev')}
        >
          <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="absolute end-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-med shadow-lg sm:end-6"
          aria-label={t('gallery.next')}
        >
          <ChevronRight className="h-5 w-5 rtl:-scale-x-100" />
        </button>
        <motion.img
          key={item.id}
          src={item.src}
          alt={t(`gallery.items.${item.id}.alt`)}
          className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        />
      </div>

      <footer className="px-4 pb-4 pt-3 sm:px-6">
        <p className="font-display text-2xl leading-tight">{t(`gallery.items.${item.id}.caption`)}</p>
        {credit ? (
          <a href={credit.source} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-aqua">
            {t('common.photoBy', { author: credit.author, license: credit.license })}
          </a>
        ) : null}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {items.map((thumb, thumbIndex) => {
            const selected = thumb.id === item.id
            return (
              <button
                key={thumb.id}
                type="button"
                onClick={() => onSelect(thumb.id)}
                aria-label={t(`gallery.items.${thumb.id}.caption`)}
                aria-current={selected ? 'true' : undefined}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                  selected ? 'ring-aqua' : 'ring-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="sr-only">{String(thumbIndex + 1).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>
      </footer>
    </motion.div>
  )
}
