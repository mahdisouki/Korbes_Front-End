export interface VoucherOffer {
  slug: string
  image: string
  price: number
  quota: number
  active: boolean
}

export interface OfferSetting {
  slug: string
  price: number
  quota: number
  active: boolean
}

export const voucherOffers: VoucherOffer[] = [
  { slug: 'bain-jour', image: '/images/source.jpg', price: 45, quota: 12, active: true },
  { slug: 'demi-journee', image: '/images/kanassira.jpg', price: 85, quota: 8, active: true },
  { slug: 'journee', image: '/images/coucher.jpg', price: 140, quota: 6, active: true },
  { slug: 'decouverte', image: '/images/crique.jpg', price: 35, quota: 20, active: true },
]

export function resolveOffers(settings: OfferSetting[] | undefined) {
  const saved = new Map((settings ?? []).map((item) => [item.slug, item]))
  return voucherOffers.map((offer) => {
    const custom = saved.get(offer.slug)
    return {
      ...offer,
      price: custom?.price ?? offer.price,
      quota: custom?.quota ?? offer.quota,
      active: custom?.active ?? offer.active,
    }
  })
}

export function voucherBySlug(slug: string, settings?: OfferSetting[]) {
  return resolveOffers(settings).find((offer) => offer.slug === slug)
}
