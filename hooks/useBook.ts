import useSWR from 'swr'

import fetcher from '@/libs/fetcher'

const useBook = (bookId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    bookId ? `/api/books/${bookId}` : null,
    fetcher
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}

export default useBook
