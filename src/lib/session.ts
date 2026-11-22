export interface SessionUser {
  id: string
  email: string
  role: string
  language: string
  firstName: string
  lastName: string
  status: string
}

interface SessionTokens {
  accessToken: string
  refreshToken: string
  user: SessionUser
}

const ACCESS_KEY = 'korbous-access'
const REFRESH_KEY = 'korbous-refresh'
const USER_KEY = 'korbous-user'

const listeners = new Set<() => void>()
let userRaw = ''
let userCache: SessionUser | null = null

function read(key: string) {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  sessionStorage.setItem(key, value)
}

function remove(key: string) {
  sessionStorage.removeItem(key)
}

function notify() {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAccessToken() {
  return read(ACCESS_KEY)
}

export function getRefreshToken() {
  return read(REFRESH_KEY)
}

export function getUser(): SessionUser | null {
  const raw = read(USER_KEY) || ''
  if (raw === userRaw) return userCache
  userRaw = raw
  if (!raw) {
    userCache = null
    return null
  }
  try {
    const parsed = JSON.parse(raw) as SessionUser
    userCache = parsed?.id ? parsed : null
  } catch {
    userCache = null
  }
  return userCache
}

export function applySession(data: SessionTokens) {
  write(ACCESS_KEY, data.accessToken)
  write(REFRESH_KEY, data.refreshToken)
  write(USER_KEY, JSON.stringify(data.user))
  userRaw = ''
  notify()
}

export function clearSession() {
  remove(ACCESS_KEY)
  remove(REFRESH_KEY)
  remove(USER_KEY)
  userRaw = ''
  userCache = null
  notify()
}
