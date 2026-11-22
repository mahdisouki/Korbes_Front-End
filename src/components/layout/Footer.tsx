import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { photoCredits } from '../../data/credits.ts'
import { routes } from '../../data/routes.ts'
import { Logo } from '../common/Logo.tsx'

const explore = [
  { to: routes.home, key: 'nav.home' },
  { to: routes.about, key: 'nav.about' },
  { to: routes.treatments, key: 'nav.treatments' },
  { to: routes.gallery, key: 'nav.gallery' },
] as const

const visit = [
  { to: routes.practical, key: 'nav.practical' },
  { to: routes.contact, key: 'nav.contact' },
  { to: routes.vouchers, key: 'nav.vouchers' },
  { to: routes.account, key: 'nav.account' },
] as const

const year = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-med-deep text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <Logo className="h-20 w-auto" />
          <p className="mt-5 max-w-sm leading-relaxed text-white/75">{t('footer.tagline')}</p>
        </div>
        <div>
          <p className="eyebrow text-aqua">{t('footer.explore')}</p>
          <ul className="mt-4 space-y-2">
            {explore.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/85 transition hover:text-white">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-aqua">{t('footer.visit')}</p>
          <ul className="mt-4 space-y-2">
            {visit.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/85 transition hover:text-white">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          <p className="max-w-3xl text-sm leading-relaxed text-white/70">{t('footer.disclaimer')}</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/55">{t('footer.source')}</p>
          <details className="mt-6 text-sm text-white/70">
            <summary className="cursor-pointer text-white">{t('footer.credits')}</summary>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {photoCredits.map((credit) => (
                <li key={credit.file}>
                  <a href={credit.source} className="underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                    {credit.author} · {credit.license}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <p className="mt-8 text-sm text-white/50">{t('footer.rights', { year })}</p>
        </div>
      </div>
    </footer>
  )
}
