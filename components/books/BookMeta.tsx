import clsx from 'clsx'

interface BookMetaProps {
  available?: boolean
  lendingDuration?: string | null
  large?: boolean
}

export const lendingLabel = (duration?: string | null) =>
  duration ? `Výpožička ${duration} ${duration !== '1' ? 'mesiace' : 'mesiac'}` : null

const BookMeta: React.FC<BookMetaProps> = ({ available, lendingDuration, large }) => {
  const lending = lendingLabel(lendingDuration)
  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className={clsx(
          'chip',
          large && 'px-3 py-1 text-sm',
          available ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'
        )}
      >
        {available ? 'Dostupná' : 'Požičaná'}
      </span>
      {lending && <span className={clsx('chip bg-sunken text-ink-soft', large && 'px-3 py-1 text-sm')}>{lending}</span>}
    </div>
  )
}

export default BookMeta
