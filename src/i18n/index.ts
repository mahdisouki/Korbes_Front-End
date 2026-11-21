import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import pl from './locales/pl.json'
import ru from './locales/ru.json'

export const languages = [
  { code: 'fr', label: 'Français', short: 'FR', dir: 'ltr' },
  { code: 'ar', label: 'العربية', short: 'ع', dir: 'rtl' },
  { code: 'en', label: 'English', short: 'EN', dir: 'ltr' },
  { code: 'pl', label: 'Polski', short: 'PL', dir: 'ltr' },
  { code: 'es', label: 'Español', short: 'ES', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', short: 'DE', dir: 'ltr' },
  { code: 'ru', label: 'Русский', short: 'RU', dir: 'ltr' },
] as const

export type LanguageCode = (typeof languages)[number]['code']

const STORAGE_KEY = 'korbous-lang'

function isLanguage(value: string | null): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

function readLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLanguage(stored)) return stored
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  return 'fr'
}

export function directionFor(code: string) {
  return code === 'ar' ? 'rtl' : 'ltr'
}

export function applyDocumentLanguage(code: string) {
  const language = isLanguage(code) ? code : 'fr'
  document.documentElement.lang = language
  document.documentElement.dir = directionFor(language)
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    /* Ignore storage failures. */
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
    pl: { translation: pl },
    es: { translation: es },
    de: { translation: de },
    ru: { translation: ru },
  },
  lng: readLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

applyDocumentLanguage(i18n.language)
i18n.on('languageChanged', applyDocumentLanguage)

export default i18n
