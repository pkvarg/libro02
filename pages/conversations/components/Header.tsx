'use client'

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Conversation, User } from '@prisma/client'

import useOtherUser from '@/hooks/useOtherUser'
import useSocket from '@/hooks/useSocket'
import { useSession } from 'next-auth/react'

import AvatarChat from '@/components/AvatarChat'
import AvatarGroup from '@/components/AvatarGroup'
import ProfileDrawer from './ProfileDrawer'

import { socketHttp } from '@/lib/socketHttp'
import { useRouter } from 'next/router'

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const router = useRouter()
  const { conversationId } = router.query
  const { socketUsers } = useSocket()

  console.log(conversationId)

  const otherUser = useOtherUser(conversation)
  const otherUserEmail = otherUser?.email
  const session = useSession()
  const currentUserEmail = session.data?.user?.email
  const [usersOnline, setUsersOnline] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [status, setStatus] = useState('Offline')

  console.log('HEADEER', socketUsers, otherUserEmail)
  useEffect(() => {
    if (socketUsers.includes(otherUserEmail)) {
      setStatus('Active')
    } else setStatus('Offline')
  }, [otherUserEmail, socketUsers, conversationId])

  console.log(otherUser.name, conversation)

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className='
        w-full
        flex
        border-b-[1px]
        sm:px-4
        py-3
        px-4
        lg:px-6
        justify-between
        items-center
        shadow-sm
      '
      >
        <div className='flex gap-3 items-center'>
          <Link
            href='/conversations'
            className='
            lg:hidden
            block
            text-sky-500
            hover:text-sky-600
            transition
            cursor-pointer
          '
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation?.isGroup ? (
            <AvatarGroup users={conversation?.users} />
          ) : (
            <AvatarChat user={otherUser} />
          )}
          <div className='flex flex-col'>
            <div>{conversation?.name || otherUser?.name}</div>
            <div className='text-sm font-light text-neutral-500'>{status}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className='
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        '
        />
      </div>
    </>
  )
}

export default Header
