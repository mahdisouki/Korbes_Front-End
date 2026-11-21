import type { LanguageCode } from '../i18n/index.ts'
import { voucherOffers, type OfferSetting } from './vouchers.ts'

export const adminAccess = {
  email: 'admin@korbous.demo',
  password: 'korbous-admin',
} as const

export type CustomerType = 'public' | 'wholesale' | 'partner'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'
export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'refunded'
export type VoucherStatus = 'issued' | 'used' | 'cancelled'
export type OrderEventKind = 'created' | 'updated' | 'status' | 'payment' | 'note' | 'cancel' | 'refund' | 'voucher'
export type ActivityAction =
  | 'order'
  | 'cancel-order'
  | 'refund'
  | 'update-order'
  | 'note'
  | 'use-voucher'
  | 'cancel-voucher'
  | 'issue-voucher'
  | 'voucher-status'
  | 'account'
  | 'partner'
  | 'credit'
  | 'staff'
  | 'catalogue'
  | 'request'
  | 'request-status'
  | 'request-assign'
  | 'request-note'
  | 'request-quote'
  | 'request-contact'

const STORAGE_KEY = 'korbous-demo-ledger'

export interface DemoUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  language: LanguageCode
  active?: boolean
}

export interface OrderEvent {
  id: string
  at: string
  kind: OrderEventKind
  detail: string
}

export interface OrderNote {
  id: string
  at: string
  text: string
}

export interface DemoOrder {
  id: string
  email: string
  phone: string
  userId: string | null
  voucherSlug: string
  visitDate: string
  beneficiary: string
  quantity: number
  unitPrice: number
  currency?: string
  customerType?: CustomerType
  paymentStatus?: PaymentStatus
  notes?: OrderNote[]
  history?: OrderEvent[]
  createdAt: string
  updatedAt?: string
  status?: OrderStatus
}

export interface DemoVoucher {
  id: string
  number: string
  orderId: string
  email: string
  userId: string | null
  voucherSlug: string
  visitDate: string
  beneficiary: string
  status: VoucherStatus
  issuedAt: string
  validFrom?: string
  validUntil?: string
}

export interface DemoInvoice {
  id: string
  number: string
  orderId: string
  email: string
  userId: string | null
  amount: number
  issuedAt: string
}

export interface Activity {
  id: string
  at: string
  action: ActivityAction
  ref: string
  actorId?: string | null
}

export const permissionKeys = [
  'customers.read',
  'customers.write',
  'orders.read',
  'orders.write',
  'vouchers.read',
  'vouchers.validate',
  'partners.read',
  'partners.write',
  'catalogue.read',
  'staff.read',
  'staff.write',
  'requests.read',
  'requests.write',
] as const

export type Permission = (typeof permissionKeys)[number]
export type StaffRole = 'agent' | 'operator'
export type PartnerStatus = 'pending' | 'approved' | 'rejected'

export const agentPermissions: Permission[] = [
  'customers.read',
  'customers.write',
  'orders.read',
  'orders.write',
  'vouchers.read',
  'partners.read',
  'requests.read',
  'requests.write',
]
export const operatorPermissions: Permission[] = ['vouchers.read', 'vouchers.validate']

export interface StaffAccount {
  id: string
  role: StaffRole
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  active: boolean
  permissions: Permission[]
  createdAt: string
}

export interface PartnerAccount {
  id: string
  company: string
  contactName: string
  email: string
  phone: string
  status: PartnerStatus
  active: boolean
  creditLimit: number
  createdAt: string
}

export const requestCategories = ['flight', 'omra', 'car', 'stay'] as const
export type RequestCategory = (typeof requestCategories)[number]
export const requestStatuses = [
  'new',
  'in_progress',
  'waiting_customer',
  'quotation_sent',
  'accepted',
  'rejected',
  'completed',
  'cancelled',
] as const
export type RequestStatus = (typeof requestStatuses)[number]
export type RequestEventKind = 'created' | 'status' | 'assign' | 'note' | 'quote' | 'price' | 'send' | 'contact'

export const requestFields = {
  flight: [
    { key: 'departureCity', kind: 'text', required: true },
    { key: 'destination', kind: 'text', required: true },
    { key: 'departureDate', kind: 'date', required: true },
    { key: 'returnDate', kind: 'date', required: false },
    { key: 'passengers', kind: 'text', required: true },
    { key: 'passengerInfo', kind: 'area', required: false },
    { key: 'special', kind: 'area', required: false },
  ],
  omra: [
    { key: 'travelers', kind: 'text', required: true },
    { key: 'departureDate', kind: 'date', required: true },
    { key: 'accommodation', kind: 'area', required: false },
    { key: 'packagePref', kind: 'area', required: false },
    { key: 'extra', kind: 'area', required: false },
  ],
  car: [
    { key: 'vehicle', kind: 'text', required: true },
    { key: 'pickupLocation', kind: 'text', required: true },
    { key: 'pickupDate', kind: 'date', required: true },
    { key: 'returnDate', kind: 'date', required: true },
    { key: 'driver', kind: 'area', required: false },
    { key: 'extra', kind: 'area', required: false },
  ],
  stay: [
    { key: 'destination', kind: 'text', required: true },
    { key: 'checkIn', kind: 'date', required: true },
    { key: 'checkOut', kind: 'date', required: true },
    { key: 'guests', kind: 'text', required: true },
    { key: 'accommodation', kind: 'text', required: false },
    { key: 'services', kind: 'area', required: false },
  ],
} as const satisfies Record<RequestCategory, readonly { key: string; kind: 'text' | 'date' | 'area'; required: boolean }[]>

export interface RequestNote {
  id: string
  at: string
  text: string
}

export interface RequestEvent {
  id: string
  at: string
  kind: RequestEventKind
  detail: string
}

export interface QuoteLine {
  id: string
  label: string
  amount: number
}

export interface Quotation {
  id: string
  number: string
  currency: string
  lines: QuoteLine[]
  message: string
  sentAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TravelRequest {
  id: string
  reference: string
  category: RequestCategory
  status: RequestStatus
  customerName: string
  email: string
  phone: string
  assigneeId: string | null
  details: Record<string, string>
  notes: RequestNote[]
  quotations: Quotation[]
  history: RequestEvent[]
  createdAt: string
  updatedAt: string
}

export interface CreditEntry {
  id: string
  partnerId: string
  at: string
  amount: number
  kind: 'charge' | 'payment'
  note: string
  orderId: string
}

interface Ledger {
  users: DemoUser[]
  sessionUserId: string | null
  adminSession: boolean
  staffSessionId: string | null
  orders: DemoOrder[]
  vouchers: DemoVoucher[]
  invoices: DemoInvoice[]
  offerSettings: OfferSetting[]
  activity: Activity[]
  staff: StaffAccount[]
  partners: PartnerAccount[]
  creditEntries: CreditEntry[]
  requests: TravelRequest[]
}

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  language: LanguageCode
}

export interface OrderInput {
  email: string
  phone: string
  userId: string | null
  voucherSlug: string
  visitDate: string
  beneficiary: string
  quantity: number
  unitPrice: number
  currency?: string
}

export interface ProfileInput {
  firstName: string
  lastName: string
  phone: string
  language: LanguageCode
}

const empty: Ledger = {
  users: [],
  sessionUserId: null,
  adminSession: false,
  staffSessionId: null,
  orders: [],
  vouchers: [],
  invoices: [],
  offerSettings: [],
  activity: [],
  staff: [],
  partners: [],
  creditEntries: [],
  requests: [],
}

function load(): Ledger {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Ledger>
    if (!parsed || !Array.isArray(parsed.users)) return empty
    return {
      users: parsed.users,
      sessionUserId: typeof parsed.sessionUserId === 'string' ? parsed.sessionUserId : null,
      adminSession: parsed.adminSession === true,
      staffSessionId: typeof parsed.staffSessionId === 'string' ? parsed.staffSessionId : null,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      vouchers: Array.isArray(parsed.vouchers) ? parsed.vouchers : [],
      invoices: Array.isArray(parsed.invoices) ? parsed.invoices : [],
      offerSettings: Array.isArray(parsed.offerSettings) ? parsed.offerSettings : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
      staff: Array.isArray(parsed.staff) ? parsed.staff : [],
      partners: Array.isArray(parsed.partners) ? parsed.partners : [],
      creditEntries: Array.isArray(parsed.creditEntries) ? parsed.creditEntries : [],
      requests: Array.isArray(parsed.requests) ? parsed.requests.map(normalizeRequest) : [],
    }
  } catch {
    return empty
  }
}

let ledger = load()
const listeners = new Set<() => void>()

function emit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger))
  } catch {
    /* The demonstration still works until the tab closes. */
  }
  for (const listener of listeners) listener()
}

function commit(next: Ledger) {
  ledger = next
  emit()
}

function currentActorId() {
  if (ledger.adminSession) return 'admin'
  return ledger.staffSessionId
}

function remember(next: Ledger, action: ActivityAction, ref: string) {
  const activity: Activity[] = [
    { id: crypto.randomUUID(), at: new Date().toISOString(), action, ref, actorId: currentActorId() },
    ...next.activity,
  ].slice(0, 60)
  return { ...next, activity }
}

export function logActivity(action: ActivityAction, ref: string) {
  commit(remember(ledger, action, ref))
}

export function orderStatus(order: DemoOrder): OrderStatus {
  return order.status ?? 'paid'
}

export function paymentStatus(order: DemoOrder): PaymentStatus {
  return order.paymentStatus ?? 'paid'
}

export function customerType(order: DemoOrder): CustomerType {
  return order.customerType ?? 'public'
}

export function orderEvents(order: DemoOrder): OrderEvent[] {
  if (order.history && order.history.length > 0) return order.history
  return [{ id: `${order.id}-created`, at: order.createdAt, kind: 'created', detail: order.id }]
}

export function voucherStatus(voucher: DemoVoucher): VoucherStatus {
  return voucher.status ?? 'issued'
}

export function voucherStatusKey(status: VoucherStatus) {
  if (status === 'used') return 'shop.statusUsed'
  if (status === 'cancelled') return 'shop.statusCancelled'
  return 'shop.statusIssued'
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getLedger() {
  return ledger
}

export function currentUser() {
  return ledger.users.find((user) => user.id === ledger.sessionUserId) ?? null
}

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function code(prefix: string, size = 6) {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  let body = ''
  for (const value of bytes) body += alphabet[value % alphabet.length]
  return `${prefix}${body}`
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function registerUser(input: RegisterInput): 'ok' | 'duplicate' {
  const email = normalizeEmail(input.email)
  if (ledger.users.some((user) => user.email === email)) return 'duplicate'
  const user: DemoUser = {
    id: crypto.randomUUID(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    phone: input.phone.trim(),
    password: input.password,
    language: input.language,
    active: true,
  }
  commit({ ...ledger, users: [...ledger.users, user], sessionUserId: user.id })
  return 'ok'
}

export function loginUser(email: string, password: string): 'ok' | 'invalid' {
  const user = ledger.users.find((item) => item.email === normalizeEmail(email) && item.password === password)
  if (!user || user.active === false) return 'invalid'
  commit({ ...ledger, sessionUserId: user.id })
  return 'ok'
}

export function logoutUser() {
  commit({ ...ledger, sessionUserId: null })
}

export function findUserByEmail(email: string) {
  return ledger.users.find((user) => user.email === normalizeEmail(email)) ?? null
}

export function resetPassword(email: string, password: string): 'ok' | 'unknown' {
  const target = findUserByEmail(email)
  if (!target) return 'unknown'
  commit({
    ...ledger,
    users: ledger.users.map((user) => (user.id === target.id ? { ...user, password } : user)),
  })
  return 'ok'
}

export function updateProfile(userId: string, input: ProfileInput) {
  commit({
    ...ledger,
    users: ledger.users.map((user) =>
      user.id === userId
        ? {
            ...user,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            phone: input.phone.trim(),
            language: input.language,
          }
        : user,
    ),
  })
}

export function placeOrder(input: OrderInput) {
  const createdAt = new Date().toISOString()
  const order: DemoOrder = {
    id: code('CMD-'),
    email: normalizeEmail(input.email),
    phone: input.phone.trim(),
    userId: input.userId,
    voucherSlug: input.voucherSlug,
    visitDate: input.visitDate,
    beneficiary: input.beneficiary.trim(),
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    currency: input.currency ?? 'TND',
    customerType: 'public',
    paymentStatus: 'paid',
    notes: [],
    history: [{ id: crypto.randomUUID(), at: createdAt, kind: 'created', detail: '' }],
    createdAt,
    status: 'paid',
  }
  const vouchers: DemoVoucher[] = Array.from({ length: input.quantity }, () => ({
    id: crypto.randomUUID(),
    number: code('KV-'),
    orderId: order.id,
    email: order.email,
    userId: order.userId,
    voucherSlug: order.voucherSlug,
    visitDate: order.visitDate,
    beneficiary: order.beneficiary,
    status: 'issued',
    issuedAt: createdAt,
  }))
  const invoice: DemoInvoice = {
    id: crypto.randomUUID(),
    number: code('FAC-'),
    orderId: order.id,
    email: order.email,
    userId: order.userId,
    amount: order.unitPrice * order.quantity,
    issuedAt: createdAt,
  }
  commit(
    remember(
      {
        ...ledger,
        orders: [order, ...ledger.orders],
        vouchers: [...vouchers, ...ledger.vouchers],
        invoices: [invoice, ...ledger.invoices],
      },
      'order',
      order.id,
    ),
  )
  return order.id
}

export function loginAdmin(email: string, password: string): 'ok' | 'invalid' {
  if (normalizeEmail(email) === adminAccess.email && password === adminAccess.password) {
    commit({ ...ledger, adminSession: true, staffSessionId: null })
    return 'ok'
  }
  const staff = ledger.staff.find((item) => item.email === normalizeEmail(email) && item.password === password && item.active)
  if (!staff) return 'invalid'
  commit({ ...ledger, adminSession: false, staffSessionId: staff.id })
  return 'ok'
}

export function logoutAdmin() {
  commit({ ...ledger, adminSession: false, staffSessionId: null })
}

export function cancelOrder(orderId: string): 'ok' | 'missing' | 'used' {
  const order = orderById(orderId)
  if (!order || orderStatus(order) === 'cancelled') return order ? 'ok' : 'missing'
  const related = ledger.vouchers.filter((voucher) => voucher.orderId === order.id)
  if (related.some((voucher) => voucherStatus(voucher) === 'used')) return 'used'
  const next = stamp({ ...order, status: 'cancelled' }, 'cancel', order.id)
  commit(
    remember(
      {
        ...ledger,
        orders: ledger.orders.map((item) => (item.id === order.id ? next : item)),
        vouchers: ledger.vouchers.map((voucher) =>
          voucher.orderId === order.id && voucherStatus(voucher) === 'issued' ? { ...voucher, status: 'cancelled' } : voucher,
        ),
      },
      'cancel-order',
      order.id,
    ),
  )
  return 'ok'
}

export function markVoucherUsed(voucherId: string): 'ok' | 'missing' {
  const voucher = ledger.vouchers.find((item) => item.id === voucherId)
  if (!voucher || voucherStatus(voucher) !== 'issued') return 'missing'
  commit(
    remember(
      {
        ...ledger,
        vouchers: ledger.vouchers.map((item) => (item.id === voucherId ? { ...item, status: 'used' } : item)),
      },
      'use-voucher',
      voucher.number,
    ),
  )
  return 'ok'
}

export function cancelVoucher(voucherId: string): 'ok' | 'missing' {
  const voucher = ledger.vouchers.find((item) => item.id === voucherId)
  if (!voucher || voucherStatus(voucher) !== 'issued') return 'missing'
  commit(
    remember(
      {
        ...ledger,
        vouchers: ledger.vouchers.map((item) => (item.id === voucherId ? { ...item, status: 'cancelled' } : item)),
      },
      'cancel-voucher',
      voucher.number,
    ),
  )
  return 'ok'
}

export function updateOffer(slug: string, patch: { price: number; quota: number; active: boolean }): 'ok' | 'missing' {
  if (!voucherOffers.some((offer) => offer.slug === slug)) return 'missing'
  const current = new Map(ledger.offerSettings.map((item) => [item.slug, item]))
  current.set(slug, { slug, price: patch.price, quota: patch.quota, active: patch.active })
  commit(
    remember(
      { ...ledger, offerSettings: [...current.values()] },
      'catalogue',
      slug,
    ),
  )
  return 'ok'
}

export function orderById(id: string) {
  return ledger.orders.find((order) => order.id.toLowerCase() === id.trim().toLowerCase()) ?? null
}

function stamp(order: DemoOrder, kind: OrderEventKind, detail: string): DemoOrder {
  const at = new Date().toISOString()
  const event: OrderEvent = { id: crypto.randomUUID(), at, kind, detail }
  return { ...order, updatedAt: at, history: [event, ...(order.history ?? [])].slice(0, 40) }
}

function replaceOrder(order: DemoOrder, action: ActivityAction, ref: string) {
  commit(
    remember(
      { ...ledger, orders: ledger.orders.map((item) => (item.id === order.id ? order : item)) },
      action,
      ref,
    ),
  )
}

export interface OrderPatch {
  email: string
  phone: string
  beneficiary: string
  visitDate: string
  quantity: number
  unitPrice: number
  currency: string
  customerType: CustomerType
  voucherSlug: string
}

export function updateOrder(orderId: string, patch: OrderPatch): 'ok' | 'missing' | 'invalid' {
  const order = orderById(orderId)
  if (!order) return 'missing'
  if (!Number.isInteger(patch.quantity) || patch.quantity < 1 || patch.quantity > 20) return 'invalid'
  if (patch.unitPrice < 0 || patch.beneficiary.trim().length < 2) return 'invalid'
  const email = normalizeEmail(patch.email)
  const user = findUserByEmail(email)
  replaceOrder(
    stamp(
      {
        ...order,
        email,
        phone: patch.phone.trim(),
        beneficiary: patch.beneficiary.trim(),
        visitDate: patch.visitDate,
        quantity: patch.quantity,
        unitPrice: patch.unitPrice,
        currency: patch.currency || 'TND',
        customerType: patch.customerType,
        voucherSlug: patch.voucherSlug.trim(),
        userId: user?.id ?? order.userId,
      },
      'updated',
      patch.voucherSlug.trim(),
    ),
    'update-order',
    order.id,
  )
  return 'ok'
}

export function addOrderNote(orderId: string, text: string): 'ok' | 'missing' | 'invalid' {
  const order = orderById(orderId)
  const note = text.trim()
  if (!order) return 'missing'
  if (note.length < 2) return 'invalid'
  const entry: OrderNote = { id: crypto.randomUUID(), at: new Date().toISOString(), text: note }
  replaceOrder(stamp({ ...order, notes: [entry, ...(order.notes ?? [])] }, 'note', note), 'note', order.id)
  return 'ok'
}

export function setOrderStatus(orderId: string, status: OrderStatus): 'ok' | 'missing' | 'used' {
  if (status === 'cancelled') return cancelOrder(orderId)
  if (status === 'refunded') return refundOrder(orderId)
  const order = orderById(orderId)
  if (!order) return 'missing'
  if (orderStatus(order) === status) return 'ok'
  replaceOrder(stamp({ ...order, status }, 'status', status), 'update-order', order.id)
  return 'ok'
}

export function setPaymentStatus(orderId: string, status: PaymentStatus): 'ok' | 'missing' {
  const order = orderById(orderId)
  if (!order) return 'missing'
  if (paymentStatus(order) === status) return 'ok'
  replaceOrder(stamp({ ...order, paymentStatus: status }, 'payment', status), 'update-order', order.id)
  return 'ok'
}

export function refundOrder(orderId: string): 'ok' | 'missing' | 'used' {
  const order = orderById(orderId)
  if (!order) return 'missing'
  if (orderStatus(order) === 'refunded') return 'ok'
  const related = ledger.vouchers.filter((voucher) => voucher.orderId === order.id)
  if (related.some((voucher) => voucherStatus(voucher) === 'used')) return 'used'
  const next = stamp({ ...order, status: 'refunded', paymentStatus: 'refunded' }, 'refund', order.id)
  commit(
    remember(
      {
        ...ledger,
        orders: ledger.orders.map((item) => (item.id === order.id ? next : item)),
        vouchers: ledger.vouchers.map((voucher) =>
          voucher.orderId === order.id && voucherStatus(voucher) === 'issued' ? { ...voucher, status: 'cancelled' } : voucher,
        ),
      },
      'refund',
      order.id,
    ),
  )
  return 'ok'
}

export interface ManualVoucherInput {
  orderId: string
  email: string
  voucherSlug: string
  beneficiary: string
  visitDate: string
  validFrom: string
  validUntil: string
}

export function issueManualVoucher(input: ManualVoucherInput): 'ok' | 'missing' | 'invalid' {
  const order = orderById(input.orderId)
  if (!order) return 'missing'
  if (input.beneficiary.trim().length < 2 || !input.visitDate) return 'invalid'
  const email = normalizeEmail(input.email || order.email)
  const user = findUserByEmail(email)
  const voucher: DemoVoucher = {
    id: crypto.randomUUID(),
    number: code('KV-'),
    orderId: order.id,
    email,
    userId: user?.id ?? null,
    voucherSlug: input.voucherSlug.trim() || order.voucherSlug,
    visitDate: input.visitDate,
    beneficiary: input.beneficiary.trim(),
    status: 'issued',
    issuedAt: new Date().toISOString(),
    validFrom: input.validFrom,
    validUntil: input.validUntil,
  }
  const next = stamp(order, 'voucher', voucher.number)
  commit(
    remember(
      {
        ...ledger,
        orders: ledger.orders.map((item) => (item.id === order.id ? next : item)),
        vouchers: [voucher, ...ledger.vouchers],
      },
      'issue-voucher',
      voucher.number,
    ),
  )
  return 'ok'
}

export interface VoucherPatch {
  email: string
  orderId: string
  beneficiary: string
  visitDate: string
  voucherSlug: string
  status: VoucherStatus
  validFrom: string
  validUntil: string
}

export function updateVoucher(voucherId: string, patch: VoucherPatch): 'ok' | 'missing' | 'order' | 'invalid' {
  const voucher = ledger.vouchers.find((item) => item.id === voucherId)
  if (!voucher) return 'missing'
  const order = orderById(patch.orderId)
  if (!order) return 'order'
  if (patch.beneficiary.trim().length < 2) return 'invalid'
  const email = normalizeEmail(patch.email)
  const user = findUserByEmail(email)
  const next: DemoVoucher = {
    ...voucher,
    email,
    userId: user?.id ?? null,
    orderId: order.id,
    beneficiary: patch.beneficiary.trim(),
    visitDate: patch.visitDate,
    voucherSlug: patch.voucherSlug.trim(),
    status: patch.status,
    validFrom: patch.validFrom,
    validUntil: patch.validUntil,
  }
  const stamped = voucher.orderId === order.id ? stamp(order, 'voucher', `${voucher.number} ${patch.status}`) : order
  commit(
    remember(
      {
        ...ledger,
        orders: ledger.orders.map((item) => (item.id === stamped.id ? stamped : item)),
        vouchers: ledger.vouchers.map((item) => (item.id === voucher.id ? next : item)),
      },
      patch.status === voucher.status ? 'voucher-status' : patch.status === 'used' ? 'use-voucher' : 'voucher-status',
      voucher.number,
    ),
  )
  return 'ok'
}

export function orderForGuest(email: string, id: string) {
  const order = orderById(id)
  if (!order || order.email !== normalizeEmail(email)) return null
  return order
}

export function vouchersForOrder(orderId: string) {
  return ledger.vouchers.filter((voucher) => voucher.orderId === orderId)
}

export function invoiceForOrder(orderId: string) {
  return ledger.invoices.find((invoice) => invoice.orderId === orderId) ?? null
}

export function ordersForUser(userId: string) {
  return ledger.orders.filter((order) => order.userId === userId)
}

export function vouchersForUser(userId: string) {
  return ledger.vouchers.filter((voucher) => voucher.userId === userId)
}

export function invoicesForUser(userId: string) {
  return ledger.invoices.filter((invoice) => invoice.userId === userId)
}

export function signedInAdmin(source: { adminSession: boolean; staffSessionId: string | null; staff: StaffAccount[] }) {
  if (source.adminSession) return true
  const staff = source.staff.find((item) => item.id === source.staffSessionId)
  return Boolean(staff?.active)
}

export function can(source: { adminSession: boolean; staffSessionId: string | null; staff: StaffAccount[] }, permission: Permission) {
  if (source.adminSession) return true
  const staff = source.staff.find((item) => item.id === source.staffSessionId)
  if (!staff?.active) return false
  return staff.permissions.includes(permission)
}

export function creditUsed(entries: CreditEntry[], partnerId: string) {
  return entries.filter((entry) => entry.partnerId === partnerId).reduce((sum, entry) => sum + entry.amount, 0)
}

export function updateCustomer(
  userId: string,
  input: { firstName: string; lastName: string; phone: string; language: LanguageCode; active: boolean },
): 'ok' | 'missing' | 'invalid' {
  const current = ledger.users.find((user) => user.id === userId)
  if (!current) return 'missing'
  if (input.firstName.trim().length < 2 || input.lastName.trim().length < 2) return 'invalid'
  commit(
    remember(
      {
        ...ledger,
        users: ledger.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                firstName: input.firstName.trim(),
                lastName: input.lastName.trim(),
                phone: input.phone.trim(),
                language: input.language,
                active: input.active,
              }
            : user,
        ),
      },
      'account',
      current.email,
    ),
  )
  return 'ok'
}

export interface PartnerInput {
  id?: string
  company: string
  contactName: string
  email: string
  phone: string
  creditLimit: number
}

export function savePartner(input: PartnerInput): 'ok' | 'duplicate' | 'invalid' {
  const email = normalizeEmail(input.email)
  const company = input.company.trim()
  if (company.length < 2 || input.contactName.trim().length < 2 || input.creditLimit < 0) return 'invalid'
  if (ledger.partners.some((partner) => partner.email === email && partner.id !== input.id)) return 'duplicate'
  if (input.id) {
    const current = ledger.partners.find((partner) => partner.id === input.id)
    if (!current) return 'invalid'
    commit(
      remember(
        {
          ...ledger,
          partners: ledger.partners.map((partner) =>
            partner.id === input.id
              ? { ...partner, company, contactName: input.contactName.trim(), email, phone: input.phone.trim(), creditLimit: input.creditLimit }
              : partner,
          ),
        },
        'partner',
        company,
      ),
    )
    return 'ok'
  }
  const partner: PartnerAccount = {
    id: crypto.randomUUID(),
    company,
    contactName: input.contactName.trim(),
    email,
    phone: input.phone.trim(),
    status: 'pending',
    active: false,
    creditLimit: input.creditLimit,
    createdAt: new Date().toISOString(),
  }
  commit(remember({ ...ledger, partners: [partner, ...ledger.partners] }, 'partner', company))
  return 'ok'
}

export function setPartnerDecision(partnerId: string, status: PartnerStatus): 'ok' | 'missing' {
  const partner = ledger.partners.find((item) => item.id === partnerId)
  if (!partner) return 'missing'
  commit(
    remember(
      {
        ...ledger,
        partners: ledger.partners.map((item) =>
          item.id === partnerId ? { ...item, status, active: status === 'approved' ? item.active || true : false } : item,
        ),
      },
      'partner',
      partner.company,
    ),
  )
  return 'ok'
}

export function setPartnerActive(partnerId: string, active: boolean): 'ok' | 'missing' {
  const partner = ledger.partners.find((item) => item.id === partnerId)
  if (!partner || partner.status !== 'approved') return partner ? 'missing' : 'missing'
  commit(
    remember(
      {
        ...ledger,
        partners: ledger.partners.map((item) => (item.id === partnerId ? { ...item, active } : item)),
      },
      'partner',
      partner.company,
    ),
  )
  return 'ok'
}

export function applyCredit(
  partnerId: string,
  amount: number,
  kind: 'charge' | 'payment',
  note: string,
  orderId = '',
): 'ok' | 'missing' | 'limit' | 'inactive' | 'invalid' {
  const partner = ledger.partners.find((item) => item.id === partnerId)
  if (!partner) return 'missing'
  if (partner.status !== 'approved' || !partner.active) return 'inactive'
  if (!Number.isFinite(amount) || amount <= 0) return 'invalid'
  const used = creditUsed(ledger.creditEntries, partnerId)
  if (kind === 'charge' && used + amount > partner.creditLimit) return 'limit'
  const entry: CreditEntry = {
    id: crypto.randomUUID(),
    partnerId,
    at: new Date().toISOString(),
    amount: kind === 'charge' ? amount : -amount,
    kind,
    note: note.trim(),
    orderId: orderId.trim(),
  }
  commit(remember({ ...ledger, creditEntries: [entry, ...ledger.creditEntries] }, 'credit', partner.company))
  return 'ok'
}

export interface StaffInput {
  id?: string
  role: StaffRole
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  active: boolean
  permissions: Permission[]
}

export function saveStaff(input: StaffInput): 'ok' | 'duplicate' | 'invalid' {
  const email = normalizeEmail(input.email)
  if (input.firstName.trim().length < 2 || input.lastName.trim().length < 2) return 'invalid'
  if (!input.id && input.password.trim().length < 8) return 'invalid'
  if (ledger.staff.some((item) => item.email === email && item.id !== input.id)) return 'duplicate'
  if (input.id) {
    const current = ledger.staff.find((item) => item.id === input.id)
    if (!current || current.role !== input.role) return 'invalid'
    const password = input.password.trim().length >= 8 ? input.password : current.password
    commit(
      remember(
        {
          ...ledger,
          staff: ledger.staff.map((item) =>
            item.id === input.id
              ? {
                  ...item,
                  firstName: input.firstName.trim(),
                  lastName: input.lastName.trim(),
                  email,
                  phone: input.phone.trim(),
                  password,
                  active: input.active,
                  permissions: input.permissions,
                }
              : item,
          ),
        },
        'staff',
        email,
      ),
    )
    return 'ok'
  }
  const account: StaffAccount = {
    id: crypto.randomUUID(),
    role: input.role,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    phone: input.phone.trim(),
    password: input.password,
    active: input.active,
    permissions: input.permissions,
    createdAt: new Date().toISOString(),
  }
  commit(remember({ ...ledger, staff: [account, ...ledger.staff] }, 'staff', email))
  return 'ok'
}

export function setStaffActive(staffId: string, active: boolean): 'ok' | 'missing' {
  const account = ledger.staff.find((item) => item.id === staffId)
  if (!account) return 'missing'
  const staffSessionId = !active && ledger.staffSessionId === staffId ? null : ledger.staffSessionId
  commit(
    remember(
      {
        ...ledger,
        staffSessionId,
        staff: ledger.staff.map((item) => (item.id === staffId ? { ...item, active } : item)),
      },
      'staff',
      account.email,
    ),
  )
  return 'ok'
}

function normalizeRequest(value: TravelRequest): TravelRequest {
  const category = requestCategories.includes(value.category) ? value.category : 'flight'
  const status = requestStatuses.includes(value.status) ? value.status : 'new'
  return {
    ...value,
    category,
    status,
    phone: value.phone ?? '',
    assigneeId: value.assigneeId ?? null,
    details: value.details && typeof value.details === 'object' ? value.details : {},
    notes: Array.isArray(value.notes) ? value.notes : [],
    quotations: Array.isArray(value.quotations) ? value.quotations : [],
    history: Array.isArray(value.history) ? value.history : [],
  }
}

function requestEvent(kind: RequestEventKind, detail: string): RequestEvent {
  return { id: crypto.randomUUID(), at: new Date().toISOString(), kind, detail }
}

function nextCode(prefix: string, taken: string[]) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const bytes = crypto.getRandomValues(new Uint8Array(4))
    let body = ''
    for (const byte of bytes) body += alphabet[byte % alphabet.length]
    const code = `${prefix}-${body}`
    if (!taken.includes(code)) return code
  }
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`
}

function partySize(category: RequestCategory, details: Record<string, string>) {
  if (category === 'flight') return Number(details.passengers)
  if (category === 'omra') return Number(details.travelers)
  if (category === 'stay') return Number(details.guests)
  return 1
}

function detailsValid(category: RequestCategory, details: Record<string, string>) {
  for (const field of requestFields[category]) {
    if (field.required && (details[field.key] ?? '').trim().length === 0) return false
  }
  if (category !== 'car') {
    const count = partySize(category, details)
    if (!Number.isInteger(count) || count < 1 || count > 99) return false
  }
  if (category === 'flight' && details.returnDate && details.returnDate < details.departureDate) return false
  if (category === 'car' && details.returnDate < details.pickupDate) return false
  if (category === 'stay' && details.checkOut < details.checkIn) return false
  return true
}

function writeRequest(current: TravelRequest, patch: Partial<TravelRequest>, action: ActivityAction) {
  const next: TravelRequest = { ...current, ...patch, updatedAt: new Date().toISOString() }
  commit(
    remember(
      { ...ledger, requests: ledger.requests.map((item) => (item.id === current.id ? next : item)) },
      action,
      current.reference,
    ),
  )
}

export function requestSummary(request: TravelRequest) {
  const details = request.details
  if (request.category === 'flight') return [details.departureCity, details.destination].filter(Boolean).join(' → ')
  if (request.category === 'car') return details.pickupLocation ?? ''
  if (request.category === 'stay') return details.destination ?? ''
  return details.departureDate ?? ''
}

export function quoteTotal(quote: Quotation) {
  return quote.lines.reduce((sum, line) => sum + line.amount, 0)
}

export function createRequest(input: {
  category: RequestCategory
  customerName: string
  email: string
  phone: string
  details: Record<string, string>
}): string | 'invalid' {
  const customerName = input.customerName.trim()
  const email = normalizeEmail(input.email)
  if (customerName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'invalid'
  if (!requestCategories.includes(input.category)) return 'invalid'
  const details: Record<string, string> = {}
  for (const field of requestFields[input.category]) details[field.key] = (input.details[field.key] ?? '').trim()
  if (!detailsValid(input.category, details)) return 'invalid'
  const now = new Date().toISOString()
  const request: TravelRequest = {
    id: crypto.randomUUID(),
    reference: nextCode('DV', ledger.requests.map((item) => item.reference)),
    category: input.category,
    status: 'new',
    customerName,
    email,
    phone: input.phone.trim(),
    assigneeId: null,
    details,
    notes: [],
    quotations: [],
    history: [requestEvent('created', input.category)],
    createdAt: now,
    updatedAt: now,
  }
  commit(remember({ ...ledger, requests: [request, ...ledger.requests] }, 'request', request.reference))
  return request.id
}

export function setRequestStatus(requestId: string, status: RequestStatus): 'ok' | 'missing' {
  const current = ledger.requests.find((item) => item.id === requestId)
  if (!current) return 'missing'
  if (!requestStatuses.includes(status) || current.status === status) return current ? 'ok' : 'missing'
  writeRequest(
    current,
    { status, history: [requestEvent('status', status), ...current.history] },
    'request-status',
  )
  return 'ok'
}

export function assignRequest(requestId: string, assigneeId: string | null): 'ok' | 'missing' | 'invalid' {
  const current = ledger.requests.find((item) => item.id === requestId)
  if (!current) return 'missing'
  if (assigneeId === current.assigneeId) return 'ok'
  const agent = assigneeId ? ledger.staff.find((item) => item.id === assigneeId && item.role === 'agent') : null
  if (assigneeId && !agent) return 'invalid'
  const name = agent ? `${agent.firstName} ${agent.lastName}` : '—'
  writeRequest(
    current,
    { assigneeId, history: [requestEvent('assign', name), ...current.history] },
    'request-assign',
  )
  return 'ok'
}

export function addRequestNote(requestId: string, text: string): 'ok' | 'missing' | 'invalid' {
  const current = ledger.requests.find((item) => item.id === requestId)
  if (!current) return 'missing'
  const note = text.trim()
  if (note.length < 2) return 'invalid'
  const entry: RequestNote = { id: crypto.randomUUID(), at: new Date().toISOString(), text: note }
  writeRequest(
    current,
    { notes: [entry, ...current.notes], history: [requestEvent('note', ''), ...current.history] },
    'request-note',
  )
  return 'ok'
}

export function logRequestContact(requestId: string, detail: string): 'ok' | 'missing' {
  const current = ledger.requests.find((item) => item.id === requestId)
  if (!current) return 'missing'
  writeRequest(current, { history: [requestEvent('contact', detail), ...current.history] }, 'request-contact')
  return 'ok'
}

export function saveQuotation(
  requestId: string,
  input: { quotationId?: string; currency: string; lines: { label: string; amount: number }[]; message: string; send: boolean },
): 'missing' | 'invalid' | string {
  const current = ledger.requests.find((item) => item.id === requestId)
  if (!current) return 'missing'
  const currency = (input.currency || 'TND').trim().toUpperCase()
  if (!/^[A-Z]{3}$/.test(currency)) return 'invalid'
  const lines: QuoteLine[] = input.lines.map((line) => ({
    id: crypto.randomUUID(),
    label: line.label.trim(),
    amount: Number(line.amount),
  }))
  if (lines.length === 0 || lines.some((line) => line.label.length < 2 || !Number.isFinite(line.amount) || line.amount < 0)) return 'invalid'
  const existing = input.quotationId ? current.quotations.find((item) => item.id === input.quotationId) : undefined
  if (input.quotationId && !existing) return 'missing'
  const now = new Date().toISOString()
  const sending = input.send && !existing?.sentAt
  const quotation: Quotation = existing
    ? { ...existing, currency, lines, message: input.message.trim(), updatedAt: now, sentAt: existing.sentAt ?? (input.send ? now : null) }
    : {
        id: crypto.randomUUID(),
        number: nextCode(
          'QT',
          ledger.requests.flatMap((item) => item.quotations.map((quote) => quote.number)),
        ),
        currency,
        lines,
        message: input.message.trim(),
        sentAt: input.send ? now : null,
        createdAt: now,
        updatedAt: now,
      }
  const quotations = existing
    ? current.quotations.map((item) => (item.id === existing.id ? quotation : item))
    : [quotation, ...current.quotations]
  const status: RequestStatus =
    sending && !['accepted', 'rejected', 'completed', 'cancelled'].includes(current.status) ? 'quotation_sent' : current.status
  const history = [
    ...(status !== current.status ? [requestEvent('status', status)] : []),
    ...(sending ? [requestEvent('send', quotation.number)] : []),
    requestEvent(existing ? 'price' : 'quote', quotation.number),
    ...current.history,
  ]
  writeRequest(current, { quotations, status, history }, 'request-quote')
  return quotation.number
}
