'use client'
import axios from 'axios'

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Conversation, User } from '@prisma/client'

import useOtherUser from '@/hooks/useOtherUser'
import { useSession } from 'next-auth/react'
import useActiveList from '@/hooks/useActiveList'

import AvatarChat from '@/components/AvatarChat'
import AvatarGroup from '@/components/AvatarGroup'
import ProfileDrawer from './ProfileDrawer'

import { useRouter } from 'next/router'
import { FullConversationType } from '@/types'

import { socketHttp } from '@/lib/socketHttp'

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation)
  const session = useSession()
  const currentUserEmail = session.data?.user?.email
  const [usersOnline, setUsersOnline] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { members } = useActiveList()

  const isActive = members.indexOf(otherUser?.email!) !== -1

  useEffect(() => {
    socketHttp.emit('addUser', currentUserEmail)
    socketHttp.on('getUsers', (activeUsers) => {
      console.log(activeUsers)

      setUsersOnline(
        activeUsers.find((user) => user.userEmail !== currentUserEmail)
      )
      //localStorage.setItem('online', JSON.stringify(users))
    })
  }, [socketHttp])

  // let online = usersOnline.find((user) => user.userEmail === currentUserEmail)
  console.log(usersOnline)

  const statusText = useMemo(() => {
    if (conversation?.isGroup === true) {
      return `${conversation.users.length} členovia`
    }

    return usersOnline ? 'Aktívny' : 'Offline'
    // return usersOnline.includes(currentUserEmail) ? 'Aktívny' : 'Offline'
    //return isActive ? 'Aktívny' : 'Offline'
  }, [conversation, isActive])

  useEffect(() => {
    socketHttp.on('getUsers', (activeUsers) => {
      console.log(activeUsers)
    })
  }, [socketHttp])

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
            <div className='text-sm font-light text-neutral-500'>
              {statusText}
            </div>
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
