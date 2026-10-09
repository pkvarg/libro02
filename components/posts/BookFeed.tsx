import useBooks from '@/hooks/useBooks'

import BookItem from './BookItem'

interface BookFeedProps {
  userId?: string
}

const BookFeed: React.FC<BookFeedProps> = ({ userId }) => {
  const { data: books = [], isLoading } = useBooks(userId)
  const visible = Array.isArray(books) ? books.filter((book: Record<string, any>) => book.active) : []

  if (!isLoading && visible.length === 0) {
    return <p className="card p-6 text-center text-ink-muted">Zatiaľ žiadne knihy.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {visible.map((book: Record<string, any>) => (
        <BookItem userId={userId} key={book.id} data={book} />
      ))}
    </div>
  )
}

export default BookFeed
