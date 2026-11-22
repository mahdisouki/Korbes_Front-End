import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PublicTreatment {
  id: string
  slug: string
  category: 'baths' | 'showers' | 'body' | 'wellness'
  duration: string
  publicPrice: number | null
  featured: boolean
  name: string
  summary: string
  description: string
  benefits: string[]
  characteristics: string[]
  info: string
  photoUrl: string | null
}

interface TreatmentState {
  status: 'loading' | 'ready' | 'error'
  treatments: PublicTreatment[]
}

function apiLocale(language: string) {
  if (language.startsWith('ar')) return 'ar'
  if (language.startsWith('en')) return 'en'
  return 'fr'
}

function mapTreatment(row: Record<string, unknown>): PublicTreatment {
  const id = String(row._id || row.id || '')
  const photos = Array.isArray(row.photos) ? row.photos : []
  const category = String(row.category || 'wellness')
  return {
    id,
    slug: String(row.slug || ''),
    category: (['baths', 'showers', 'body', 'wellness'].includes(category) ? category : 'wellness') as PublicTreatment['category'],
    duration: String(row.duration || ''),
    publicPrice: row.publicPrice == null ? null : Number(row.publicPrice),
    featured: Boolean(row.featured),
    name: String(row.name || row.slug || ''),
    summary: String(row.summary || ''),
    description: String(row.description || ''),
    benefits: Array.isArray(row.benefitLines) ? row.benefitLines.map(String) : [],
    characteristics: Array.isArray(row.characteristicLines) ? row.characteristicLines.map(String) : [],
    info: String(row.info || ''),
    photoUrl: photos.length ? `/api/v1/treatments/${id}/photo` : null,
  }
}

export function usePublicTreatments(): TreatmentState {
  const { i18n } = useTranslation()
  const [state, setState] = useState<TreatmentState>({ status: 'loading', treatments: [] })

  useEffect(() => {
    let alive = true
    setState((current) => ({ ...current, status: 'loading' }))
    fetch('/api/v1/treatments', {
      headers: { Accept: 'application/json', 'Accept-Language': apiLocale(i18n.language) },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('load')
        return response.json() as Promise<{ data?: Record<string, unknown>[] }>
      })
      .then((body) => {
        if (!alive) return
        const rows = Array.isArray(body.data) ? body.data : []
        setState({ status: 'ready', treatments: rows.map(mapTreatment) })
      })
      .catch(() => {
        if (alive) setState({ status: 'error', treatments: [] })
      })
    return () => {
      alive = false
    }
  }, [i18n.language])

  return state
}
