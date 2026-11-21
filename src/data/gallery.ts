import type { GalleryCategory, GalleryItem } from '../types/index.ts'
import { galleryCategories } from '../types/index.ts'

export { galleryCategories }
export type { GalleryCategory }

export const galleryItems: GalleryItem[] = [
  { id: 'rue', src: '/images/rue-01.jpg', categories: ['facilities'], wide: true },
  { id: 'ville', src: '/images/ville.jpg', categories: ['facilities'] },
  { id: 'station', src: '/images/station.jpg', categories: ['facilities'] },
  { id: 'rue-haute', src: '/images/rue-02.jpg', categories: ['facilities'] },
  { id: 'source', src: '/images/source.jpg', categories: ['pools', 'treatments'] },
  { id: 'kanassira', src: '/images/kanassira.jpg', categories: ['pools', 'nature'] },
  { id: 'cotes', src: '/images/cotes.jpg', categories: ['nature'], wide: true },
  { id: 'crique', src: '/images/crique.jpg', categories: ['nature'] },
  { id: 'falaise', src: '/images/falaise.jpg', categories: ['nature'] },
  { id: 'colline', src: '/images/colline.jpg', categories: ['nature', 'relaxation'] },
  { id: 'rocheuse', src: '/images/rocheuse.jpg', categories: ['nature'] },
  { id: 'sunset', src: '/images/sunset.jpg', categories: ['relaxation'], wide: true },
  { id: 'coucher', src: '/images/coucher.jpg', categories: ['relaxation'] },
  { id: 'lune', src: '/images/lune.jpg', categories: ['relaxation'] },
]
