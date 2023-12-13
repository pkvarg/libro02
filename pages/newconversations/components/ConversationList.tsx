'use client'

import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import SidebarItem from '@/components/layout/SidebarItem'
import { BsHouseFill } from 'react-icons/bs'
import useConversation from '@/hooks/useConversation'
import ConversationBox from './ConversationBox'
import { FullConversationType } from '@/types'

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
  title?: string
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
  const session = useSession()

  const { conversationId, isOpen } = useConversation()

  const emailKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  return (
    <>
      <aside
        className={clsx(
          `
        fixed
        inset-y-0
        pb-20
        
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-gray-200
      `,
          isOpen ? 'hidden' : 'block w-[25%] lg:w-[25%] left-0'
        )}
      >
        <div className='px-5'>
          <div className='flex gap-4 mb-4 pt-4'>
            <div
              onClick={() => router.push('/newconversations')}
              className='cursor-pointer lg:text-2xl font-bold text-[#ffffff] flex flex-col lg:flex-row gap-2'
            >
              <p>Správy</p>
            </div>
          </div>

          {!items
            ? items?.map((item) => (
                <ConversationBox
                  key={item.id}
                  data={item}
                  selected={conversationId === item.id}
                />
              ))
            : initialItems?.map((item) => (
                <ConversationBox
                  key={item.id}
                  data={item}
                  selected={conversationId === item.id}
                />
              ))}
        </div>
        <div className='ml-6'>
          <SidebarItem
            onClick={() => router.push('/')}
            icon={BsHouseFill}
            label='Domov'
          />
        </div>
      </aside>
    </>
  )
}

export default ConversationList
