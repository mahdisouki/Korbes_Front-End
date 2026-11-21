import type { Treatment, TreatmentCategory } from '../types/index.ts'
import { treatmentCategories } from '../types/index.ts'

export { treatmentCategories }
export type { TreatmentCategory }

export const treatments: Treatment[] = [
  {
    slug: 'bain-individuel',
    category: 'baths',
    image: '/images/source.jpg',
    imageId: 'source',
    featured: true,
  },
  {
    slug: 'douche-thermale',
    category: 'showers',
    image: '/images/kanassira.jpg',
    imageId: 'kanassira',
    featured: true,
  },
  {
    slug: 'massage-affusion',
    category: 'body',
    image: '/images/coucher.jpg',
    imageId: 'coucher',
    featured: true,
  },
  {
    slug: 'enveloppement',
    category: 'body',
    image: '/images/falaise.jpg',
    imageId: 'falaise',
  },
  {
    slug: 'soin-visage',
    category: 'wellness',
    image: '/images/lune.jpg',
    imageId: 'lune',
  },
  {
    slug: 'parcours-detente',
    category: 'wellness',
    image: '/images/sunset.jpg',
    imageId: 'sunset',
  },
  {
    slug: 'seance-relaxation',
    category: 'wellness',
    image: '/images/cotes.jpg',
    imageId: 'cotes',
  },
  {
    slug: 'decouverte-station',
    category: 'baths',
    image: '/images/rue-01.jpg',
    imageId: 'rue',
  },
]

export function getTreatment(slug: string | undefined) {
  return treatments.find((treatment) => treatment.slug === slug)
}
