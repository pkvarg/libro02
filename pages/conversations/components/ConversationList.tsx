'use client'

import { Conversation } from '@prisma/client'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { MdOutlineGroupAdd } from 'react-icons/md'
import clsx from 'clsx'
import { find, uniq } from 'lodash'
import SidebarItem from '@/components/layout/SidebarItem'
import { BsHouseFill } from 'react-icons/bs'
import { ActiveStatus } from './ActiveStatus'
import useConversation from '@/hooks/useConversation'
import GroupChatModal from '@/pages/conversations/components/GroupChatModal'
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

  useEffect(() => {
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            }
          }

          return currentConversation
        })
      )
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current
        }

        return [conversation, ...current]
      })
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)]
      })
      // not in repo redirect after delete
      if (conversationId === conversation.id) {
        router.push('/conversations')
      }
    }
  }, [router, conversationId])

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
              onClick={() => router.push('/conversations')}
              className='cursor-pointer lg:text-2xl font-bold text-[#ffffff] flex flex-col lg:flex-row gap-2'
            >
              <p>Správy</p>
              <ActiveStatus />
            </div>
            {/* Open Group Chat */}
            {/* <div
              onClick={() => setIsModalOpen(true)}
              className='
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              '
            >
              <MdOutlineGroupAdd size={20} />
            </div> */}
          </div>

          {initialItems?.map((item) => (
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
