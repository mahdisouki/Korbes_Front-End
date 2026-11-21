import { useTranslation } from 'react-i18next'
import { Benefits } from '../components/home/Benefits.tsx'
import { Facilities } from '../components/home/Facilities.tsx'
import { FeaturedTreatments } from '../components/home/FeaturedTreatments.tsx'
import { GalleryPreview } from '../components/home/GalleryPreview.tsx'
import { Hero } from '../components/home/Hero.tsx'
import { Introduction } from '../components/home/Introduction.tsx'
import { LocationBand } from '../components/home/LocationBand.tsx'
import { Testimonials } from '../components/home/Testimonials.tsx'
import { WhyKorbous } from '../components/home/WhyKorbous.tsx'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function Home() {
  const { t } = useTranslation()
  usePageMeta(t('meta.home.title'), t('meta.home.description'))

  return (
    <>
      <Hero />
      <Introduction />
      <Benefits />
      <FeaturedTreatments />
      <Facilities />
      <GalleryPreview />
      <WhyKorbous />
      <Testimonials />
      <LocationBand />
    </>
  )
}
