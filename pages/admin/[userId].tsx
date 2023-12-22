import React, { useState, useEffect, useCallback } from 'react'
import getCurrentUser from '@/hooks/useCurrentUser'
import { useRouter } from 'next/router'
import axios from 'axios'
import Avatar from '@/components/Avatar'
import { BiArrowBack } from 'react-icons/bi'
import { BsTrash } from 'react-icons/bs'
import { set } from 'lodash'

const Page = () => {
  const { data } = getCurrentUser()
  const router = useRouter()
  const [user, setUser] = useState<Record<string, any>>()

  const [showConvIds, setShowConvIds] = useState(false)
  const [showSeenIds, setShowSeenIds] = useState(false)
  const [rerender, setRerender] = useState(0)

  const { userId } = router.query

  const isAdmin = data?.isAdmin
  const name = data?.name

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin])

  useEffect(() => {
    const getUserById = async () => {
      const { data } = await axios.get(`/api/users/${userId}`)
      console.log('dt', data)
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
    console.log('dcv', data)
    setRerender((prev) => prev + 1)
  }

  return (
    isAdmin &&
    user && (
      <div className='h-[100vh] ml-2'>
        <BiArrowBack
          onClick={handleBack}
          color='white'
          size={20}
          className='mt-4 cursor-pointer hover:opacity-70 transition'
        />
        <div className='flex flex-col justify-center gap-2 mt-2 mx-4 lg:mx-0'>
          <div className='flex flex-row gap-2 items-center'>
            <Avatar userId={user.id} hasBorder={true} />
            <p>{user?.name}</p>
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-row gap-4 items-center'>
              <p
                onClick={() => setShowConvIds((prev) => !prev)}
                className='text-gray-500 text-[20px] cursor-pointer'
              >
                ConversationIds
              </p>
            </div>
            {showConvIds &&
              user.conversationIds.map((convId) => (
                <div className='flex flex-row gap-4 items-center'>
                  <p>{convId}</p>
                  <BsTrash
                    onClick={() => deleteConvId(convId)}
                    className='text-red-500 cursor-pointer'
                  />
                </div>
              ))}
          </div>
          <div className='flex flex-col'>
            <p
              onClick={() => setShowSeenIds((prev) => !prev)}
              className='text-gray-500 text-[20px] cursor-pointer'
            >
              SeenMessagesIds
            </p>
            {showSeenIds &&
              user.seenMessageIds.map((seenId) => <p>{seenId}</p>)}
          </div>
        </div>
      </div>
    )
  )
}

export default Page
