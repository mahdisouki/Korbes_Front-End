import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContactForm } from '../components/contact/ContactForm.tsx'
import { PageHero } from '../components/common/PageHero.tsx'
import { site } from '../data/site.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function Contact() {
  const { t } = useTranslation()
  usePageMeta(t('meta.contact.title'), t('meta.contact.description'))

  return (
    <>
      <PageHero
        eyebrow={t('nav.contact')}
        title={t('contact.heroTitle')}
        text={t('contact.heroText')}
        image="/images/coucher.jpg"
        imageAlt={t('contact.heroAlt')}
      />
      <section className="bg-beige py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ContactForm />
          <aside className="space-y-5">
            <div className="rounded-[1.75rem] bg-med p-7 text-white">
              <h2 className="font-display text-3xl">{t('contact.asideTitle')}</h2>
              <ul className="mt-6 space-y-5">
                <li className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-aqua" aria-hidden />
                  <div>
                    <p className="text-sm text-aqua">{t('contact.addressLabel')}</p>
                    <p className="mt-1 leading-relaxed">{t('contact.address')}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-aqua" aria-hidden />
                  <div>
                    <p className="text-sm text-aqua">{t('contact.emailLabel')}</p>
                    <p className="mt-1" dir="ltr">
                      {t('contact.emailValue')}
                    </p>
                    <p className="mt-1 text-sm text-white/70">{t('contact.emailNote')}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-aqua" aria-hidden />
                  <div>
                    <p className="text-sm text-aqua">{t('contact.phoneLabel')}</p>
                    <p className="mt-1" dir="ltr">
                      {t('contact.phoneValue')}
                    </p>
                    <p className="mt-1 text-sm text-white/70">{t('contact.phoneNote')}</p>
                  </div>
                </li>
              </ul>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-med"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {t('contact.whatsapp')}
              </a>
              <p className="mt-3 text-sm text-white/70">{t('contact.whatsappNote')}</p>
            </div>
            <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-med/10">
              <iframe
                title={t('contact.mapLabel')}
                src={site.mapEmbed}
                className="h-64 w-full border-0"
                loading="lazy"
              />
              <a
                href={site.mapLink}
                target="_blank"
                rel="noreferrer"
                className="block bg-white px-5 py-3 text-sm text-turquoise"
              >
                {t('contact.mapOpen')}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
