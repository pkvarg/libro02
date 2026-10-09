import clsx from 'clsx'
import { HiMagnifyingGlass } from 'react-icons/hi2'

export const AdminSearch: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div className="relative">
    <HiMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
    <input
      type="search"
      placeholder="Hľadať..."
      aria-label="Hľadať"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input rounded-full py-2.5 pl-11"
    />
  </div>
)

// Green when on, red when off; click toggles.
export const StatusToggle: React.FC<{ label: string; on: boolean; onClick: () => void }> = ({ label, on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    title={on ? `${label}: áno – kliknutím vypnúť` : `${label}: nie – kliknutím zapnúť`}
    className={clsx(
      'focus-ring inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors',
      on ? 'bg-success-soft text-success hover:bg-success/15' : 'bg-danger-soft text-danger hover:bg-danger/15'
    )}
  >
    <span className={clsx('h-2 w-2 rounded-full', on ? 'bg-success' : 'bg-danger')} />
    {label}
  </button>
)
