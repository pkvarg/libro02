import useBooks from '@/hooks/useBooks'

import BookItem from './BookItem'

interface BookFeedProps {
  userId?: string
}

const BookFeed: React.FC<BookFeedProps> = ({ userId }) => {
  const { data: books = [] } = useBooks(userId)

  return (
    <div className='h-[100vh]'>
      {books.map(
        (book: Record<string, any>) =>
          book.active && <BookItem userId={userId} key={book.id} data={book} />
      )}
    </div>
  )
}

export default BookFeed
