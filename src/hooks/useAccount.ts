import { useSyncExternalStore } from 'react'
import { apiJson } from '../lib/api.ts'
import { clearSession, getUser, subscribe } from '../lib/session.ts'

export function useUser() {
  return useSyncExternalStore(subscribe, getUser, () => null)
}

export async function logout() {
  try {
    if (getUser()) await apiJson('/auth/logout', { method: 'POST' })
  } catch {
    /* The local session is cleared either way. */
  }
  clearSession()
}
