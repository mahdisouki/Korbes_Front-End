import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero } from '../components/common/PageHero.tsx'
import { useObjectList } from '../hooks/useObjectList.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

type Hour = { days: string; time: string }
type Faq = { q: string; a: string }

export function PracticalInformation() {
  const { t } = useTranslation()
  usePageMeta(t('meta.practical.title'), t('meta.practical.description'))
  const hours = useObjectList<Hour>('practical.hours')
  const steps = useObjectList<string>('practical.steps')
  const useful = useObjectList<string>('practical.useful')
  const faqs = useObjectList<Faq>('practical.faqs')
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <PageHero
        eyebrow={t('nav.practical')}
        title={t('practical.heroTitle')}
        text={t('practical.heroText')}
        image="/images/colline.jpg"
        imageAlt={t('practical.heroAlt')}
      />
      <section className="bg-beige py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
          <article className="rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-36px_rgba(12, 30, 124),0.45)] sm:p-9">
            <h2 className="font-display text-4xl text-med">{t('practical.hoursTitle')}</h2>
            <p className="mt-4 rounded-2xl bg-aqua px-4 py-3 text-sm leading-relaxed text-med">
              {t('practical.hoursNotice')}
            </p>
            <dl className="mt-6 divide-y divide-sand">
              {hours.map((hour) => (
                <div key={hour.days} className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-ink">{hour.days}</dt>
                  <dd className="text-end text-mist" dir="ltr">
                    {hour.time}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
          <article className="rounded-[1.75rem] bg-med p-7 text-white sm:p-9">
            <h2 className="font-display text-4xl">{t('practical.locationTitle')}</h2>
            <p className="mt-4 leading-relaxed text-white/80">{t('practical.locationText')}</p>
            <h3 className="mt-8 font-display text-2xl text-aqua">{t('practical.accessTitle')}</h3>
            <ol className="mt-4 space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-2xl text-aqua">0{index + 1}</span>
                  <span className="leading-relaxed text-white/85">{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
        <div className="mx-auto mt-6 w-full max-w-6xl px-5 sm:px-8">
          <article className="rounded-[1.75rem] bg-white p-7 sm:p-9">
            <h2 className="font-display text-4xl text-med">{t('practical.usefulTitle')}</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {useful.map((item) => (
                <li key={item} className="rounded-2xl bg-beige px-5 py-4 leading-relaxed text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <div className="mt-6">
            <h2 className="font-display text-4xl text-med">{t('practical.faqTitle')}</h2>
            <div className="mt-6 divide-y divide-sand rounded-[1.75rem] bg-white px-6">
              {faqs.map((faq, index) => {
                const expanded = open === index
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 py-5 text-start"
                      aria-expanded={expanded}
                      onClick={() => setOpen(expanded ? null : index)}
                    >
                      <span className="text-lg text-med">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-turquoise transition ${expanded ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    {expanded ? <p className="pb-5 leading-relaxed text-mist">{faq.a}</p> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
