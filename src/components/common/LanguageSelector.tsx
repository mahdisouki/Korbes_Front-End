import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { languages, type LanguageCode } from '../../i18n/index.ts'

export function LanguageSelector({ light = false }: { light?: boolean }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = languages.find((language) => language.code === i18n.language) ?? languages[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (code: LanguageCode) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t('nav.language')}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ${
          light ? 'text-white hover:bg-white/10' : 'text-med hover:bg-aqua'
        }`}
      >
        {current.short}
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t('nav.language')}
          className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl bg-white py-2 text-ink shadow-[0_24px_60px_-30px_rgba(12, 30, 124),0.6)] ring-1 ring-med/10"
        >
          {languages.map((language) => {
            const selected = language.code === current.code
            return (
              <li key={language.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(language.code)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-start text-sm transition hover:bg-aqua ${
                    selected ? 'font-semibold text-med' : 'text-ink'
                  }`}
                >
                  <span>{language.label}</span>
                  <span className="text-xs text-mist">{language.short}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
