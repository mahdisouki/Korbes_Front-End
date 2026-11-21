type Option = { id: string; label: string }

export function FilterBar({
  options,
  value,
  onChange,
  label,
}: {
  options: Option[]
  value: string
  onChange: (id: string) => void
  label: string
}) {
  return (
    <div role="toolbar" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selected
                ? 'bg-med text-white'
                : 'bg-white text-med ring-1 ring-med/10 hover:bg-aqua'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
