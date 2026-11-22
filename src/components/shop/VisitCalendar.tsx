import { useTranslation } from 'react-i18next'

export interface DayAvailability {
  day: string
  available: boolean
  remaining: number | null
  blocked: boolean
}

function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split('-').map(Number)
  const date = new Date(year || 1970, (monthNumber || 1) - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function weekdayLabels(language: string) {
  const monday = new Date(2026, 0, 5)
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(language, { weekday: 'narrow' }).format(
      new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index),
    ),
  )
}

export function VisitCalendar({
  month,
  today,
  days,
  status,
  selected,
  onMonth,
  onSelect,
  error,
}: {
  month: string
  today: string
  days: DayAvailability[]
  status: 'loading' | 'ready' | 'error'
  selected: string
  onMonth: (month: string) => void
  onSelect: (day: string) => void
  error?: string
}) {
  const { t, i18n } = useTranslation()
  const [year, monthNumber] = month.split('-').map(Number)
  const first = new Date(year || 1970, (monthNumber || 1) - 1, 1)
  const pad = (first.getDay() + 6) % 7
  const title = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(first)
  const byDay = new Map(days.map((day) => [day.day, day]))
  const cells = [...Array(pad).fill(null), ...days.map((day) => day.day)]

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-full border border-med/15 px-4 py-2 text-sm text-med disabled:opacity-40"
          disabled={month <= today.slice(0, 7)}
          onClick={() => onMonth(shiftMonth(month, -1))}
        >
          {t('shop.previousMonth')}
        </button>
        <p className="text-sm font-medium capitalize text-med">{title}</p>
        <button
          type="button"
          className="rounded-full border border-med/15 px-4 py-2 text-sm text-med"
          onClick={() => onMonth(shiftMonth(month, 1))}
        >
          {t('shop.nextMonth')}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-mist">
        {weekdayLabels(i18n.language).map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      {status === 'loading' ? <p className="mt-4 text-sm text-mist">{t('shop.loading')}</p> : null}
      {status === 'error' ? <p className="mt-4 text-sm text-med">{t('shop.loadError')}</p> : null}
      {status === 'ready' ? (
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((iso, index) => {
            if (!iso) return <span key={`pad-${index}`} />
            const day = byDay.get(iso)
            const available = Boolean(day?.available)
            const selectedDay = iso === selected
            const label = iso.slice(-2).replace(/^0/, '')
            const detail = !available
              ? day?.blocked
                ? t('shop.dayBlocked')
                : day?.remaining === 0
                  ? t('shop.dayFull')
                  : t('shop.dayPast')
              : day?.remaining == null
                ? t('shop.unlimited')
                : t('shop.remaining', { count: day?.remaining })
            return (
              <button
                key={iso}
                type="button"
                disabled={!available}
                aria-pressed={selectedDay}
                aria-label={`${iso}. ${detail}`}
                className={`rounded-xl px-1 py-2 text-sm ${
                  selectedDay
                    ? 'bg-turquoise text-white'
                    : available
                      ? 'bg-beige text-ink hover:bg-aqua'
                      : 'text-mist/50'
                }`}
                onClick={() => onSelect(iso)}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-med">{error}</p> : null}
    </div>
  )
}
