import { useSyncExternalStore } from 'react'
import { getProducts, subscribeCatalog } from '../data/catalog.ts'

export function useCatalog() {
  return useSyncExternalStore(subscribeCatalog, getProducts, getProducts)
}
