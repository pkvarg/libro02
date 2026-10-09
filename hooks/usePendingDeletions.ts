import useSWR from 'swr'

import fetcher from '@/libs/fetcher'
import useCurrentUser from '@/hooks/useCurrentUser'

// Admin only: members who asked to delete their account and still wait for the admin.
const usePendingDeletions = () => {
  const { data: currentUser } = useCurrentUser()
  const { data: users } = useSWR(currentUser?.isAdmin ? '/api/users' : null, fetcher)
  const pending = (Array.isArray(users) ? users : []).filter(
    (user: Record<string, any>) => user.deletionRequestedAt
  )
  return pending.sort(
    (a: Record<string, any>, b: Record<string, any>) =>
      new Date(a.deletionRequestedAt).getTime() - new Date(b.deletionRequestedAt).getTime()
  )
}

export default usePendingDeletions
