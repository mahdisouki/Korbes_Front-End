export function DemoNote({ children }: { children: string }) {
  return (
    <p className="rounded-2xl bg-aqua/70 px-4 py-3 text-sm leading-relaxed text-med">{children}</p>
  )
}

export function QrMark({ seed }: { seed: string }) {
  const cells = Array.from({ length: 49 }, (_, index) => {
    const code = seed.charCodeAt(index % seed.length) + index * 17
    return code % 3 !== 0
  })

  return (
    <div className="inline-grid grid-cols-7 gap-1 rounded-2xl bg-white p-3 ring-1 ring-sand" aria-hidden>
      {cells.map((filled, index) => (
        <span key={index} className={`h-3 w-3 rounded-[2px] ${filled ? 'bg-med' : 'bg-sand'}`} />
      ))}
    </div>
  )
}
