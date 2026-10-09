import useSWR from 'swr'

import fetcher from '@/libs/fetcher'

export type FollowListType = 'followers' | 'following'

const useFollows = (userId?: string, type?: FollowListType) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId && type ? `/api/follows/${userId}?type=${type}` : null,
    fetcher
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}

export default useFollows
