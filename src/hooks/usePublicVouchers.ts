import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PublicVoucher {
  id: string
  slug: string
  name: string
  description: string
  conditions: string
  duration: string
  publicPrice: number
  photoUrl: string | null
}

interface VoucherState {
  status: 'loading' | 'ready' | 'error'
  vouchers: PublicVoucher[]
}

function apiLocale(language: string) {
  if (language.startsWith('ar')) return 'ar'
  if (language.startsWith('en')) return 'en'
  return 'fr'
}

function mapVoucher(row: Record<string, unknown>): PublicVoucher {
  const id = String(row._id || row.id || '')
  const photos = Array.isArray(row.photos) ? row.photos : []
  return {
    id,
    slug: String(row.slug || ''),
    name: String(row.name || row.slug || ''),
    description: String(row.description || ''),
    conditions: String(row.conditions || ''),
    duration: row.duration == null ? '' : String(row.duration),
    publicPrice: Number(row.publicPrice || 0),
    photoUrl: photos.length ? `/api/v1/vouchers/${id}/photo` : null,
  }
}

export function usePublicVouchers(): VoucherState {
  const { i18n } = useTranslation()
  const [state, setState] = useState<VoucherState>({ status: 'loading', vouchers: [] })

  useEffect(() => {
    let alive = true
    setState((current) => ({ ...current, status: 'loading' }))
    fetch('/api/v1/vouchers', {
      headers: { Accept: 'application/json', 'Accept-Language': apiLocale(i18n.language) },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('load')
        return response.json() as Promise<{ data?: Record<string, unknown>[] }>
      })
      .then((body) => {
        if (!alive) return
        const rows = Array.isArray(body.data) ? body.data : []
        setState({ status: 'ready', vouchers: rows.map(mapVoucher) })
      })
      .catch(() => {
        if (alive) setState({ status: 'error', vouchers: [] })
      })
    return () => {
      alive = false
    }
  }, [i18n.language])

  return state
}
