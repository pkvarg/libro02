import React, { useCallback, useState } from 'react'
import useUsers from '@/hooks/useUsers'
import Avatar from '@/components/Avatar'
import useCurrentUser from '@/hooks/useCurrentUser'
import axios from 'axios'
import { useRouter } from 'next/router'

const index = () => {
  const { data: users = [] } = useUsers()
  const { data: currentUser } = useCurrentUser()
  const isCurrentUser = currentUser !== undefined
  // conversation
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const startConversation = useCallback(
    (recipientId: string) => {
      setIsLoading(true)
      console.log(recipientId)
      axios
        .post('/api/conversations', {
          //userId: currentUser?.id,
          userId: recipientId,
        })
        .then((data) => {
          console.log('dta', data)
          router.push(`/conversations/${data.data.id}`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [currentUser, router]
  )

  if (users.length === 0) {
    return null
  } else if (!isCurrentUser) {
    return null
  }

  return (
    <div className='px-6 py-4 block'>
      <div className='bg-neutral-800 rounded-xl p-4'>
        <h2 className='text-white text-xl font-semibold'>Sledovať</h2>
        <div className='flex flex-col gap-6 mt-4'>
          {users.map((user: Record<string, any>) => (
            <div key={user.id} className='flex flex-row gap-4'>
              <Avatar userId={user.id} />
              <div className='flex flex-col'>
                <p className='text-white font-semibold text-sm'>{user.name}</p>
                <p className='text-neutral-400 text-sm'>@{user.username}</p>
              </div>
              <div className='ml-auto'>
                <button
                  onClick={() => startConversation(user.id)}
                  className='bg-[#20aceb] w-[100px] rounded-xl cursor-pointer hover:opacity-[0.7]'
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default index
