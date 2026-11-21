export function Logo({ className = 'h-14 w-auto' }: { className?: string }) {
  return (
    <img
      src="/images/logo.jpg"
      alt="Mlayah Voyages"
      className={`shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-sand ${className}`}
    />
  )
}
