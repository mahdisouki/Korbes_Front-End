import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'

const styles: Record<Variant, string> = {
  primary: 'bg-med text-white shadow-[0_16px_34px_-20px_rgba(12,30,124,0.75)] hover:bg-mist hover:text-med',
  secondary: 'border border-white bg-transparent text-white hover:bg-white hover:text-med',
  ghost: 'border border-sand bg-white text-med hover:border-med',
  light: 'bg-white text-med hover:bg-aqua',
}

type Props = {
  variant?: Variant
  to?: string
  href?: string
  external?: boolean
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  to,
  href,
  external = false,
  children,
  className = '',
  type = 'button',
  ...props
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise ${styles[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
