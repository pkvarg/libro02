import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSWRConfig } from 'swr'

import useCurrentUser from './useCurrentUser'
import useLoginModal from './useLoginModal'

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const loginModal = useLoginModal()

  const isFollowing = useMemo(() => {
    const list = currentUser?.followingIds || []

    return list.includes(userId)
  }, [currentUser, userId])

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen()
    }

    try {
      setIsLoading(true)
      let request

      if (isFollowing) {
        request = () => axios.delete('/api/follow', { data: { userId } })
      } else {
        request = () => axios.post('/api/follow', { userId })
      }

      await request()
      await mutateCurrentUser()
      // Profile counts and follower lists that include this user.
      mutate((key) => typeof key === 'string' && (key.startsWith('/api/users/') || key.startsWith('/api/follows/')))

      toast.success(isFollowing ? 'Už nesledujete' : 'Sledujete')
    } catch (error) {
      toast.error('Nastala chyba')
    } finally {
      setIsLoading(false)
    }
  }, [currentUser, isFollowing, userId, mutateCurrentUser, mutate, loginModal])

  return {
    isFollowing,
    toggleFollow,
    isLoading,
  }
}

export default useFollow
