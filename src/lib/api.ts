import { applySession, clearSession, getAccessToken, getRefreshToken } from './session.ts'

export class ApiError extends Error {
  status: number
  code: string
  fields: { field: string; day?: string }[]

  constructor(status: number, code: string, message: string, fields: { field: string; day?: string }[] = []) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

interface ErrorBody {
  success?: boolean
  code?: string
  message?: string
  fields?: { field: string; day?: string }[]
}

let refreshTask: Promise<boolean> | null = null

export function apiLocale(language: string) {
  if (language.startsWith('ar')) return 'ar'
  if (language.startsWith('en')) return 'en'
  return 'fr'
}

export function idempotencyKey() {
  return crypto.randomUUID()
}

async function readBody(response: Response): Promise<ErrorBody & Record<string, unknown>> {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as ErrorBody & Record<string, unknown>
  } catch {
    return { message: text }
  }
}

function fail(response: Response, body: ErrorBody): never {
  throw new ApiError(response.status, body.code || 'request_failed', body.message || 'Request failed', body.fields || [])
}

async function refreshSession() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  if (!refreshTask) {
    refreshTask = fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        const body = await readBody(response)
        const data = body.data as { accessToken?: string; refreshToken?: string; user?: SessionShape } | undefined
        if (!response.ok || !body.success || !data?.accessToken || !data.refreshToken || !data.user) {
          clearSession()
          return false
        }
        applySession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user })
        return true
      })
      .catch(() => {
        clearSession()
        return false
      })
      .finally(() => {
        refreshTask = null
      })
  }
  return refreshTask
}

interface SessionShape {
  id: string
  email: string
  role: string
  language: string
  firstName: string
  lastName: string
  status: string
}

export async function apiRequest(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const headers = new Headers(init.headers)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`/api/v1${path}`, { ...init, headers })
  if (response.status === 401 && retry && token && !path.startsWith('/auth/')) {
    const refreshed = await refreshSession()
    if (refreshed) return apiRequest(path, init, false)
  }
  return response
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const response = await apiRequest(path, { ...init, headers })
  const body = await readBody(response)
  if (!response.ok || body.success === false) fail(response, body)
  return body as T
}

export async function apiBlob(path: string) {
  const response = await apiRequest(path)
  const type = response.headers.get('Content-Type') || ''
  if (!response.ok || type.includes('application/json')) {
    const body = await readBody(response)
    fail(response, body)
  }
  return response.blob()
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
