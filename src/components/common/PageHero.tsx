import { Reveal } from './Reveal.tsx'

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
}: {
  eyebrow?: string
  title: string
  text: string
  image: string
  imageAlt: string
}) {
  return (
    <section className="relative isolate flex min-h-[68vh] items-end overflow-hidden">
      <img src={image} alt={imageAlt} className="photo-drift absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-med-deep via-med-deep/45 to-med-deep/10" />
      <Reveal className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-36 sm:px-8 sm:pb-20">
        {eyebrow ? <p className="eyebrow text-aqua">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{text}</p>
      </Reveal>
    </section>
  )
}
