'use client'

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import { useState } from 'react'
import Link from 'next/link'
import { Conversation, User } from '@prisma/client'
import useOtherUser from '@/hooks/useOtherUser'
import AvatarChat from '@/components/AvatarChat'
import AvatarGroup from '@/components/AvatarGroup'
import ProfileDrawer from './ProfileDrawer'
import { useRouter } from 'next/router'

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const router = useRouter()
  const { conversationId } = router.query
  const otherUser = useOtherUser(conversation)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [status, setStatus] = useState('Offline')

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5 md:px-5">
        <Link href="/conversations" className="icon-btn md:hidden" aria-label="Späť na správy">
          <HiChevronLeft size={26} />
        </Link>
        {conversation?.isGroup ? (
          <AvatarGroup users={conversation?.users} />
        ) : (
          <Link
            href={otherUser ? `/users/${otherUser.id}` : '#'}
            className="focus-ring flex min-w-0 items-center gap-3 rounded-full pr-2 hover:opacity-90"
          >
            <AvatarChat user={otherUser} />
            <span className="min-w-0">
              <span className="block truncate font-semibold text-ink hover:underline">
                {conversation?.name || otherUser?.name}
              </span>
              {otherUser?.username && (
                <span className="block truncate text-xs text-ink-muted">@{otherUser.username}</span>
              )}
            </span>
          </Link>
        )}
        {conversation?.isGroup && <div className="font-semibold text-ink">{conversation?.name}</div>}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="icon-btn ml-auto"
          aria-label="Možnosti konverzácie"
        >
          <HiEllipsisHorizontal size={24} />
        </button>
      </div>
    </>
  )
}

export default Header
