export function formatMillimes(millimes: number, language: string) {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(Number(millimes || 0) / 1000)
}

export function formatMoney(amount: number, language: string, currency = 'TND') {
  const code = currency || 'TND'
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'TND' ? 0 : 2,
  }).format(amount)
}

export function formatDay(isoDate: string, language: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year || 1970, (month || 1) - 1, day || 1)
  return new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(date)
}

export function formatWhen(iso: string, language: string) {
  return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}

export function todayIso() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
