import { useTranslation } from 'react-i18next'
import { Button } from '../components/common/Button.tsx'
import { routes } from '../data/routes.ts'
import { usePageMeta } from '../hooks/usePageMeta.ts'

export function NotFound() {
  const { t } = useTranslation()
  usePageMeta(t('meta.notFound.title'), t('meta.notFound.description'))

  return (
    <section className="bg-beige px-5 py-40 text-center">
      <h1 className="font-display text-5xl text-med">{t('notFound.title')}</h1>
      <p className="mx-auto mt-4 max-w-md text-mist">{t('notFound.text')}</p>
      <Button to={routes.home} className="mt-8">
        {t('common.backHome')}
      </Button>
    </section>
  )
}
