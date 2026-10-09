import { useMemo } from 'react'
import { FullConversationType } from '@/types'
import { User } from '@prisma/client'

import useCurrentUser from './useCurrentUser'

// The other participant, matched by id (chat responses no longer contain e-mails).
const useOtherUser = (
  conversation: FullConversationType | { users: User[] | undefined }
) => {
  const { data: currentUser } = useCurrentUser()

  const otherUser = useMemo(() => {
    const otherUser = conversation?.users?.filter((user) => user.id !== currentUser?.id)
    if (otherUser !== undefined) return otherUser[0]
  }, [currentUser?.id, conversation?.users])

  return otherUser
}

export default useOtherUser
