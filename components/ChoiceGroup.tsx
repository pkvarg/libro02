import clsx from 'clsx'

interface ChoiceGroupProps<T> {
  label: string
  value?: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

// Segmented single choice, e.g. lending period or availability.
function ChoiceGroup<T extends string | boolean>({ label, value, options, onChange }: ChoiceGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="label">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={clsx(
                'focus-ring min-h-[40px] rounded-full border px-4 text-sm font-medium transition-colors',
                selected
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line-strong bg-surface text-ink-soft hover:bg-sunken'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChoiceGroup
