import clsx from 'clsx'
import { HiOutlineBookOpen } from 'react-icons/hi2'

interface BookCoverProps {
  src?: string | null
  title?: string
  className?: string
}

const BookCover: React.FC<BookCoverProps> = ({ src, title, className }) => (
  <div className={clsx('relative aspect-[2/3] shrink-0 overflow-hidden rounded-md bg-sunken shadow-sm', className)}>
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={title ? `Obálka: ${title}` : 'Obálka knihy'} className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-ink-faint">
        <HiOutlineBookOpen size={32} />
      </div>
    )}
  </div>
)

export default BookCover
