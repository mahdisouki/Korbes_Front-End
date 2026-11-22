export interface ApiOrderLine {
  id: string
  voucherTypeId: string
  quantity: number
  unitPrice: number
  visitDate: string
  total: number
  beneficiaries: string[]
}

export interface ApiIssuedVoucher {
  id: string
  publicId: string
  beneficiary: string
  visitDate: string
  status: string
  qrToken?: string
  pdfReady?: boolean
  voucherTypeId?: string
}

export interface ApiOrder {
  id: string
  orderCode: string
  status: string
  paymentMode: string
  paymentCode?: string
  currency: string
  guestEmail?: string
  subtotal: number
  vatTotal: number
  stampDuty: number
  total: number
  createdAt: string
  lines: ApiOrderLine[]
  vouchers: ApiIssuedVoucher[]
}

export interface StoredOrder {
  order: ApiOrder
  payment?: { reference: string; status: string; amount: number }
}

const STORAGE_KEY = 'korbous-orders'

function readAll(): Record<string, StoredOrder> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, StoredOrder>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function rememberOrder(entry: StoredOrder) {
  const all = readAll()
  all[entry.order.id] = entry
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function rememberedOrder(id: string) {
  return readAll()[id] ?? null
}
