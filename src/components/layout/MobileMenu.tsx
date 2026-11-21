import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { routes } from '../../data/routes.ts'
import { useUser } from '../../hooks/useAccount.ts'
import { Button } from '../common/Button.tsx'
import { LanguageSelector } from '../common/LanguageSelector.tsx'
import { Logo } from '../common/Logo.tsx'

const links = [
  { to: routes.home, key: 'nav.home' },
  { to: routes.about, key: 'nav.about' },
  { to: routes.treatments, key: 'nav.treatments' },
  { to: routes.vouchers, key: 'nav.vouchers' },
  { to: routes.gallery, key: 'nav.gallery' },
  { to: routes.practical, key: 'nav.practical' },
  { to: routes.contact, key: 'nav.contact' },
] as const

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const user = useUser()
  const from = i18n.dir() === 'rtl' ? '-100%' : '100%'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-med-deep text-white xl:hidden"
      initial={{ x: from }}
      animate={{ x: 0 }}
      exit={{ x: from }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.openMenu')}
    >
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo className="h-14 w-auto" />
        <button
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20"
          aria-label={t('nav.closeMenu')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pb-10 sm:px-8">
        {links.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.04 }}
          >
            <NavLink
              to={link.to}
              end={link.to === routes.home}
              onClick={onClose}
              className={({ isActive }) =>
                `block border-b border-white/10 py-4 font-display text-4xl ${
                  isActive ? 'text-aqua' : 'text-white'
                }`
              }
            >
              {t(link.key)}
            </NavLink>
          </motion.div>
        ))}
        <NavLink
          to={user ? routes.account : routes.login}
          onClick={onClose}
          className="block border-b border-white/10 py-4 font-display text-4xl text-white"
        >
          {user ? t('shop.hello', { name: user.firstName }) : t('nav.login')}
        </NavLink>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LanguageSelector light />
          <Button to={routes.treatments} variant="light" onClick={onClose}>
            {t('nav.cta')}
          </Button>
        </div>
      </nav>
    </motion.div>
  )
}
