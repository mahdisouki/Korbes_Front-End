type Props = {
  eyebrow?: string
  title: string
  text?: string
  light?: boolean
  align?: 'start' | 'center'
}

export function SectionTitle({ eyebrow, title, text, light = false, align = 'start' }: Props) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-start'}>
      {eyebrow ? (
        <p className={`eyebrow ${light ? 'text-aqua' : 'text-turquoise'}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`mt-3 font-display text-4xl leading-[1.1] sm:text-5xl ${light ? 'text-white' : 'text-med'}`}
      >
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-white/80' : 'text-mist'}`}>
          {text}
        </p>
      ) : null}
    </div>
  )
}
