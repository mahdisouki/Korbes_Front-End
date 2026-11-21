export const treatmentCategories = ['all', 'baths', 'showers', 'body', 'wellness'] as const
export type TreatmentCategory = (typeof treatmentCategories)[number]

export const galleryCategories = [
  'all',
  'facilities',
  'pools',
  'nature',
  'relaxation',
  'treatments',
] as const
export type GalleryCategory = (typeof galleryCategories)[number]

export interface Treatment {
  slug: string
  category: Exclude<TreatmentCategory, 'all'>
  image: string
  imageId: string
  featured?: boolean
}

export interface GalleryItem {
  id: string
  src: string
  categories: Exclude<GalleryCategory, 'all'>[]
  wide?: boolean
}

export interface PhotoCredit {
  file: string
  author: string
  license: string
  source: string
}
