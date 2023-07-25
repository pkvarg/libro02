import useSWR from 'swr'

import fetcher from '@/libs/fetcher'

const useBooks = (userId?: string) => {
  const url = userId ? `/api/books?userId=${userId}` : '/api/books'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}

export default useBooks
