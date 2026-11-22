import { Menu, UserRound } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { routes } from '../../data/routes.ts'
import { logout, useUser } from '../../hooks/useAccount.ts'
import { useLockBody } from '../../hooks/useLockBody.ts'
import { Button } from '../common/Button.tsx'
import { LanguageSelector } from '../common/LanguageSelector.tsx'
import { Logo } from '../common/Logo.tsx'
import { MobileMenu } from './MobileMenu.tsx'

const links = [
  { to: routes.home, key: 'nav.home' },
  { to: routes.about, key: 'nav.about' },
  { to: routes.treatments, key: 'nav.treatments' },
  { to: routes.vouchers, key: 'nav.vouchers' },
  { to: routes.gallery, key: 'nav.gallery' },
  { to: routes.practical, key: 'nav.practical' },
  { to: routes.contact, key: 'nav.contact' },
] as const

function hasDarkHero(pathname: string) {
  if (
    pathname === routes.home ||
    pathname === routes.about ||
    pathname === routes.treatments ||
    pathname === routes.gallery ||
    pathname === routes.practical ||
    pathname === routes.contact ||
    pathname === routes.vouchers
  ) {
    return true
  }
  return pathname.startsWith(`${routes.treatments}/`)
}

export function Navbar() {
  const { t } = useTranslation()
  const user = useUser()
  const { pathname } = useLocation()
  const [solid, setSolid] = useState(() => window.scrollY > 24)
  const [open, setOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const overDarkHero = hasDarkHero(pathname)

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  useLockBody(open)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const light = overDarkHero && !solid && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition duration-300 ${
        solid || !overDarkHero ? 'border-b border-sand bg-white/95 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <NavLink to={routes.home} className="flex items-center" aria-label={t('nav.homeLabel')}>
          <Logo className="h-14 w-auto sm:h-16" />
        </NavLink>

        <nav className="hidden items-center gap-4 xl:flex" aria-label={t('nav.primary')}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === routes.home}
              className={({ isActive }) =>
                `text-sm transition ${
                  light
                    ? isActive
                      ? 'text-white underline decoration-[#6F8CA4] underline-offset-8'
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-med'
                      : 'text-mist hover:text-med'
                }`
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSelector light={light} />
          {user ? (
            <div className="flex items-center">
              <Link
                to={routes.account}
                className={`max-w-28 truncate rounded-full px-3 py-2 text-sm font-medium ${
                  light ? 'text-white hover:bg-white/10' : 'text-med hover:bg-aqua'
                }`}
              >
                {user.firstName}
              </Link>
              <button
                type="button"
                onClick={() => {
                  void logout()
                }}
                className={`hidden rounded-full px-3 py-2 text-sm sm:inline ${light ? 'text-white/85' : 'text-mist'}`}
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              to={routes.login}
              aria-label={t('nav.login')}
              className={`grid h-11 w-11 place-items-center rounded-full ${
                light ? 'text-white hover:bg-white/10' : 'text-med hover:bg-aqua'
              }`}
            >
              <UserRound className="h-5 w-5" />
            </Link>
          )}
          <Button to={routes.treatments} variant={light ? 'light' : 'primary'} className="hidden px-5 lg:inline-flex">
            {t('nav.cta')}
          </Button>
          <button
            type="button"
            className={`grid h-11 w-11 place-items-center rounded-full xl:hidden ${
              light ? 'text-white hover:bg-white/10' : 'text-med hover:bg-aqua'
            }`}
            aria-label={t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <AnimatePresence>{open ? <MobileMenu onClose={() => setOpen(false)} /> : null}</AnimatePresence>
    </header>
  )
}
