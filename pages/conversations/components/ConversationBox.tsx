'use client'

import { useCallback, useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import AvatarChat from '@/components/AvatarChat'
import useOtherUser from '@/hooks/useOtherUser'
import AvatarGroup from '@/components/AvatarGroup'
import { FullConversationType } from '@/types'

interface ConversationBoxProps {
  data: FullConversationType
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data)
  const session = useSession()
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data, router])

  const lastMessage = useMemo(() => {
    const messages = data?.messages || [] || undefined

    return messages[messages.length - 1]
  }, [data?.messages])

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  )

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false
    }

    const seenArray = lastMessage.seen || []

    if (!userEmail) {
      return false
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0
  }, [userEmail, lastMessage])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Poslaný obrázok'
    }

    if (lastMessage?.body) {
      return lastMessage?.body
    }

    return 'Začatá konverzácia'
  }, [lastMessage])

  return (
    <>
      <div
        onClick={handleClick}
        className={clsx(
          `
        w-min
        lg:w-max 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-900
        rounded-lg
        transition
        cursor-pointer
        `,
          selected ? 'border border-neutral-100' : ''
        )}
      >
        {data?.isGroup ? (
          <AvatarGroup users={data?.users} />
        ) : (
          <div className='flex flex-col'>
            <AvatarChat user={otherUser} />
            <div
              className={
                isOnline
                  ? `block lg:hidden h-[2px] mt-1 bg-emerald-600`
                  : `block lg:hidden h-[2px] mt-1 bg-red-800`
              }
            ></div>
          </div>
        )}
        <div className='min-w-0 hidden lg:flex'>
          <div className='focus:outline-none'>
            <span className='absolute inset-0' aria-hidden='true' />
            <div className='flex flex-row justify-betweem items-center gap-2 mb-1'>
              <p className='text-md font-medium text-white'>
                {data?.name || otherUser?.name}
              </p>
              <div>
                {lastMessage?.createdAt && (
                  <p
                    className='
                  text-xs 
                  text-gray-400 
                  font-light
                  
                '
                  >
                    {format(new Date(lastMessage.createdAt), 'p')}
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <div
                className={
                  isOnline
                    ? `bg-emerald-600 h-4 w-4 rounded-xl`
                    : `bg-red-800 h-4 w-4 rounded-xl`
                }
              ></div>
              <p
                className={clsx(
                  `
              truncate 
              text-sm
              `,
                  hasSeen ? 'text-gray-500' : 'text-white font-medium'
                )}
              >
                {lastMessageText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConversationBox
