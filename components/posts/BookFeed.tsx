import useBooks from '@/hooks/useBooks'

import BookItem from './BookItem'

interface BookFeedProps {
  userId?: string
}

const BookFeed: React.FC<BookFeedProps> = ({ userId }) => {
  const { data: books = [] } = useBooks(userId)

  return (
    <>
      {books.map((book: Record<string, any>) => (
        <BookItem userId={userId} key={book.id} data={book} />
      ))}
    </>
  )
}

export default BookFeed
