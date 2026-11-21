import ar from '../i18n/locales/ar.json'
import de from '../i18n/locales/de.json'
import en from '../i18n/locales/en.json'
import es from '../i18n/locales/es.json'
import fr from '../i18n/locales/fr.json'
import pl from '../i18n/locales/pl.json'
import ru from '../i18n/locales/ru.json'
import { logActivity, getLedger } from './accountStore.ts'
import { voucherOffers } from './vouchers.ts'
import { languages, type LanguageCode } from '../i18n/index.ts'

export type { LanguageCode }

export const catalogCurrencies = ['TND', 'EUR', 'USD'] as const
export type CatalogCurrency = (typeof catalogCurrencies)[number]

export const voucherKinds = ['dated', 'open', 'pack'] as const
export type VoucherKind = (typeof voucherKinds)[number]

export const builtinCategories = ['baths', 'stays', 'discovery', 'wellness'] as const

export const libraryImages = [
  '/images/source.jpg',
  '/images/kanassira.jpg',
  '/images/coucher.jpg',
  '/images/crique.jpg',
  '/images/sunset.jpg',
  '/images/station.jpg',
  '/images/ville.jpg',
  '/images/rue-01.jpg',
] as const

const copyFields = ['name', 'summary', 'description', 'conditions', 'extra'] as const
export type CopyField = (typeof copyFields)[number]

export interface ProductCopy {
  name: string
  summary: string
  description: string
  conditions: string
  extra: string
}

export interface ProductPhoto {
  id: string
  src: string
  name: string
}

export interface PriceSnapshot {
  at: string
  currency: CatalogCurrency
  publicPrice: number
  wholesalePrice: number
  partnerPrice: number
}

export interface VoucherConfig {
  type: VoucherKind
  validDays: number
  validFrom: string
  validUntil: string
  maxUses: number
  requiresBeneficiary: boolean
  quota: number
}

export interface CatalogProduct {
  id: string
  reference: string
  category: string
  active: boolean
  currency: CatalogCurrency
  publicPrice: number
  wholesalePrice: number
  partnerPrice: number
  priceHistory: PriceSnapshot[]
  voucher: VoucherConfig
  photos: ProductPhoto[]
  mainPhotoId: string
  translations: Record<LanguageCode, ProductCopy>
  createdAt: string
  updatedAt: string
}

interface CatalogDb {
  ready: boolean
  products: CatalogProduct[]
}

const STORAGE_KEY = 'korbous-catalog'
const locales = { fr, ar, en, pl, es, de, ru }

export function emptyCopy(): ProductCopy {
  return { name: '', summary: '', description: '', conditions: '', extra: '' }
}

export function emptyTranslations(): Record<LanguageCode, ProductCopy> {
  return {
    fr: emptyCopy(),
    ar: emptyCopy(),
    en: emptyCopy(),
    pl: emptyCopy(),
    es: emptyCopy(),
    de: emptyCopy(),
    ru: emptyCopy(),
  }
}

export function translationScore(copy: ProductCopy | undefined) {
  const source = copy ?? emptyCopy()
  const filled = copyFields.filter((field) => source[field].trim().length > 0).length
  return { filled, total: copyFields.length, complete: filled === copyFields.length }
}

export function productText(product: CatalogProduct, language: string): ProductCopy {
  const code = languages.some((item) => item.code === language) ? (language as LanguageCode) : 'fr'
  const current = product.translations[code] ?? emptyCopy()
  const fallback = product.translations.fr ?? emptyCopy()
  const pick = (field: CopyField) => current[field].trim() || fallback[field].trim()
  return {
    name: pick('name') || product.reference,
    summary: pick('summary'),
    description: pick('description'),
    conditions: pick('conditions'),
    extra: pick('extra'),
  }
}

export function mainPhoto(product: CatalogProduct) {
  return product.photos.find((photo) => photo.id === product.mainPhotoId) ?? product.photos[0]
}

function blankVoucher(quota: number): VoucherConfig {
  return {
    type: 'dated',
    validDays: 30,
    validFrom: '',
    validUntil: '',
    maxUses: 1,
    requiresBeneficiary: true,
    quota,
  }
}

function copyFor(slug: string, code: LanguageCode): ProductCopy {
  const items = locales[code].shop?.items as Record<string, { name?: string; summary?: string; duration?: string }> | undefined
  const item = items?.[slug]
  return {
    name: item?.name ?? '',
    summary: item?.summary ?? '',
    description: '',
    conditions: '',
    extra: item?.duration ?? '',
  }
}

const seedMeta: Record<string, { category: string; image: string; kind: VoucherKind }> = {
  'bain-jour': { category: 'baths', image: '/images/source.jpg', kind: 'dated' },
  'demi-journee': { category: 'stays', image: '/images/kanassira.jpg', kind: 'dated' },
  journee: { category: 'stays', image: '/images/coucher.jpg', kind: 'pack' },
  decouverte: { category: 'discovery', image: '/images/crique.jpg', kind: 'open' },
}

function seedProducts(): CatalogProduct[] {
  const settings = new Map(getLedger().offerSettings.map((item) => [item.slug, item]))
  const now = new Date().toISOString()
  return voucherOffers.map((offer) => {
    const custom = settings.get(offer.slug)
    const meta = seedMeta[offer.slug] ?? { category: 'wellness', image: offer.image, kind: 'dated' as const }
    const publicPrice = custom?.price ?? offer.price
    const wholesalePrice = Math.max(1, Math.round(publicPrice * 0.8))
    const photoId = crypto.randomUUID()
    const translations = emptyTranslations()
    for (const language of languages) translations[language.code] = copyFor(offer.slug, language.code)
    const snapshot: PriceSnapshot = {
      at: now,
      currency: 'TND',
      publicPrice,
      wholesalePrice,
      partnerPrice: wholesalePrice,
    }
    return {
      id: crypto.randomUUID(),
      reference: offer.slug,
      category: meta.category,
      active: custom?.active ?? offer.active,
      currency: 'TND',
      publicPrice,
      wholesalePrice,
      partnerPrice: wholesalePrice,
      priceHistory: [snapshot],
      voucher: { ...blankVoucher(custom?.quota ?? offer.quota), type: meta.kind },
      photos: [{ id: photoId, src: meta.image, name: meta.image }],
      mainPhotoId: photoId,
      translations,
      createdAt: now,
      updatedAt: now,
    }
  })
}

function load(): CatalogDb {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CatalogDb>
      if (parsed.ready && Array.isArray(parsed.products)) return { ready: true, products: parsed.products }
    }
  } catch {
    /* Seed a fresh catalogue. */
  }
  const seeded = { ready: true, products: seedProducts() }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  } catch {
    /* The catalogue still works until the tab closes. */
  }
  return seeded
}

let db = load()
const listeners = new Set<() => void>()

function commit(next: CatalogDb) {
  db = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* Keep the in-memory catalogue. */
  }
  for (const listener of listeners) listener()
}

export function subscribeCatalog(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getProducts() {
  return db.products
}

export function productById(id: string) {
  return db.products.find((product) => product.id === id) ?? null
}

export function productByReference(reference: string) {
  const key = reference.trim().toLowerCase()
  return db.products.find((product) => product.reference.toLowerCase() === key) ?? null
}

export function labelForReference(products: CatalogProduct[], reference: string, language: string) {
  const product = products.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase())
  return product ? productText(product, language).name : reference
}

export function categoriesInUse() {
  const custom = db.products.map((product) => product.category).filter((category) => !builtinCategories.includes(category as (typeof builtinCategories)[number]))
  return [...builtinCategories, ...new Set(custom)]
}

function pricesChanged(current: CatalogProduct, next: Pick<CatalogProduct, 'currency' | 'publicPrice' | 'wholesalePrice' | 'partnerPrice'>) {
  return (
    current.currency !== next.currency ||
    current.publicPrice !== next.publicPrice ||
    current.wholesalePrice !== next.wholesalePrice ||
    current.partnerPrice !== next.partnerPrice
  )
}

export function saveProduct(input: CatalogProduct): 'ok' | 'duplicate' {
  const reference = input.reference.trim()
  const clash = db.products.some((product) => product.id !== input.id && product.reference.toLowerCase() === reference.toLowerCase())
  if (clash) return 'duplicate'
  const existing = productById(input.id)
  const now = new Date().toISOString()
  const snapshot: PriceSnapshot = {
    at: now,
    currency: input.currency,
    publicPrice: input.publicPrice,
    wholesalePrice: input.wholesalePrice,
    partnerPrice: input.partnerPrice,
  }
  const history = existing
    ? pricesChanged(existing, input)
      ? [snapshot, ...existing.priceHistory].slice(0, 12)
      : existing.priceHistory
    : [snapshot]
  const product: CatalogProduct = { ...input, reference, priceHistory: history, updatedAt: now, createdAt: existing?.createdAt ?? now }
  const products = existing ? db.products.map((item) => (item.id === product.id ? product : item)) : [product, ...db.products]
  commit({ ...db, products })
  logActivity('catalogue', product.reference)
  return 'ok'
}

export function deleteProduct(id: string) {
  const product = productById(id)
  if (!product) return
  commit({ ...db, products: db.products.filter((item) => item.id !== id) })
  logActivity('catalogue', product.reference)
}

export function setProductActive(id: string, active: boolean) {
  const product = productById(id)
  if (!product || product.active === active) return
  saveProduct({ ...product, active })
}
