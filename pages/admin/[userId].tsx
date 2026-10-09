import React, { useState, useEffect, useCallback } from 'react'
import getCurrentUser from '@/hooks/useCurrentUser'
import { useRouter } from 'next/router'
import axios from 'axios'
import Avatar from '@/components/Avatar'
import { BiArrowBack } from 'react-icons/bi'
import { BsTrash } from 'react-icons/bs'

const Page = () => {
  const { data, isLoading: isUserLoading } = getCurrentUser()
  const router = useRouter()
  const [user, setUser] = useState<Record<string, any>>()

  const [showConvIds, setShowConvIds] = useState(false)
  const [showSeenIds, setShowSeenIds] = useState(false)
  const [rerender, setRerender] = useState(0)

  const { userId } = router.query

  const isAdmin = data?.isAdmin
  const name = data?.name

  // Wait until the current user has loaded, otherwise a hard reload always redirects.
  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, isUserLoading])

  useEffect(() => {
    const getUserById = async () => {
      const { data } = await axios.get(`/api/users/${userId}`)
      setUser(data)
    }
    getUserById()
  }, [userId, rerender])

  const handleBack = useCallback(() => {
    router.push('/admin')
  }, [router])

  const deleteConvId = async (conversationId: string) => {
    const { data } = await axios.post(
      `/api/users/delConversationIds/${conversationId}`,
      { userId: userId }
    )
    setRerender((prev) => prev + 1)
  }

  const deleteAllSeenIds = async () => {
    await axios.delete(`/api/users/delSeenIds/${userId}`)
    setRerender((prev) => prev + 1)
  }

  return (
    isAdmin &&
    user && (
      <div className='mx-auto min-h-screen max-w-3xl pt-4'>
        <button type='button' onClick={handleBack} className='btn btn-ghost -ml-3' aria-label='Späť na administráciu'>
          <BiArrowBack size={18} />
          Administrácia
        </button>
        <div className='card mt-3 flex flex-col gap-5 p-5'>
          <div className='flex items-center gap-3'>
            <Avatar userId={user.id} src={user.profileImage ?? null} name={user.name} />
            <div>
              <p className='font-semibold text-ink'>{user?.name}</p>
              <p className='text-sm text-ink-muted'>@{user?.username}</p>
            </div>
          </div>
          <div>
            <button
              type='button'
              onClick={() => setShowConvIds((prev) => !prev)}
              aria-expanded={showConvIds}
              className='focus-ring rounded text-sm font-semibold text-ink-soft hover:text-ink'
            >
              ConversationIds ({user.conversationIds?.length || 0})
            </button>
            {showConvIds &&
              user.conversationIds.map((convId) => (
                <div key={convId} className='mt-1 flex items-center gap-2 font-mono text-xs text-ink-soft'>
                  <span className='break-all'>{convId}</span>
                  <button
                    type='button'
                    onClick={() => deleteConvId(convId)}
                    className='icon-btn h-8 w-8 hover:bg-danger-soft hover:text-danger'
                    aria-label={`Odstrániť ${convId}`}
                  >
                    <BsTrash size={14} />
                  </button>
                </div>
              ))}
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => setShowSeenIds((prev) => !prev)}
                aria-expanded={showSeenIds}
                className='focus-ring rounded text-sm font-semibold text-ink-soft hover:text-ink'
              >
                SeenMessagesIds ({user.seenMessageIds?.length || 0})
              </button>
              <button
                type='button'
                onClick={deleteAllSeenIds}
                className='icon-btn h-8 w-8 hover:bg-danger-soft hover:text-danger'
                aria-label='Odstrániť všetky SeenMessagesIds'
              >
                <BsTrash size={14} />
              </button>
            </div>
            {showSeenIds &&
              user.seenMessageIds.map((seenId) => (
                <p key={seenId} className='break-all font-mono text-xs text-ink-soft'>
                  {seenId}
                </p>
              ))}
          </div>
        </div>
      </div>
    )
  )
}

export default Page
