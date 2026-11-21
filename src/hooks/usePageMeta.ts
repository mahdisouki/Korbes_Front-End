import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function usePageMeta(title: string, description: string) {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description, i18n.language])
}
