import { useSyncExternalStore } from 'react'
import { getLedger, subscribe } from '../data/accountStore.ts'

export function useLedger() {
  return useSyncExternalStore(subscribe, getLedger, getLedger)
}

export function useUser() {
  const ledger = useLedger()
  return ledger.users.find((user) => user.id === ledger.sessionUserId) ?? null
}
