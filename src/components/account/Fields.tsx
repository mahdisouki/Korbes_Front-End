import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const control =
  'mt-2 w-full rounded-2xl border bg-beige px-4 py-3 text-ink outline-none transition focus:border-turquoise'

export function TextField({
  id,
  label,
  error,
  hint,
  className = '',
  ...props
}: {
  id: string
  label: string
  error?: string
  hint?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${control} ${error ? 'border-mist' : 'border-transparent'}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-med">
          {error}
        </p>
      ) : null}
      {hint && !error ? <p className="mt-2 text-sm text-mist">{hint}</p> : null}
    </div>
  )
}

export function SelectField({
  id,
  label,
  error,
  children,
  ...props
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${control} ${error ? 'border-mist' : 'border-transparent'}`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-med">
          {error}
        </p>
      ) : null}
    </div>
  )
}
