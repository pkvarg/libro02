import axios from 'axios'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

import useCurrentUser from './useCurrentUser'
import useLoginModal from './useLoginModal'

// Opens (or creates) the 1:1 conversation with another member.
const useStartConversation = () => {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const loginModal = useLoginModal()
  const [isLoading, setIsLoading] = useState(false)

  const startConversation = useCallback(
    (recipientId: string) => {
      if (!currentUser) {
        loginModal.onOpen()
        return
      }
      setIsLoading(true)
      axios
        .post('/api/conversations', { userId: recipientId })
        .then((data) => {
          router.push(`/conversations/${data.data.id}`)
        })
        .catch(() => toast.error('Nastala chyba'))
        .finally(() => {
          setIsLoading(false)
        })
    },
    [currentUser, loginModal, router]
  )

  return { startConversation, isLoading }
}

export default useStartConversation
