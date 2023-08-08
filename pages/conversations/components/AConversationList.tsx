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
import axios from 'axios'

import useConversation from '@/hooks/useConversation'
// import { pusherClient } from '@/app/libs/pusher'
// import GroupChatModal from '@/app/components/modals/GroupChatModal'
import ConversationBox from './ConversationBox'
import { FullConversationType } from '@/types'

interface ConversationListProps {
  title?: string
}

const AConversationList: React.FC<ConversationListProps> = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
  const session = useSession()

  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState<FullConversationType[]>()

  const { conversationId, isOpen } = useConversation()

  useEffect(() => {
    const getActions = async () => {
      const { data } = await axios.get('/api/conversations/actions')
      console.log('ddat:', data)
      if (data) {
        setUsers(data?.users)
        setConversations(data?.conversations)
      }
    }
    getActions()
  }, [])

  const pusherKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  useEffect(() => {
    if (!pusherKey) {
      return
    }

    //pusherClient.subscribe(pusherKey)

    // const updateHandler = (conversation: FullConversationType) => {
    //   setItems((current) =>
    //     current.map((currentConversation) => {
    //       if (currentConversation.id === conversation.id) {
    //         return {
    //           ...currentConversation,
    //           messages: conversation.messages,
    //         }
    //       }

    //       return currentConversation
    //     })
    //   )
    // }

    // const newHandler = (conversation: FullConversationType) => {
    //   setItems((current) => {
    //     if (find(current, { id: conversation.id })) {
    //       return current
    //     }

    //     return [conversation, ...current]
    //   })
    // }

    // const removeHandler = (conversation: FullConversationType) => {
    //   setItems((current) => {
    //     return [...current.filter((convo) => convo.id !== conversation.id)]
    //   })
    // }

    // pusherClient.bind('conversation:update', updateHandler)
    // pusherClient.bind('conversation:new', newHandler)
    // pusherClient.bind('conversation:remove', removeHandler)
  }, [pusherKey, router])

  return (
    <>
      {/* <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
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
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className='px-5'>
          <div className='flex gap-4 mb-4 pt-4'>
            <div className='text-2xl font-bold text-[#ffffff]'>Správy</div>
            {/* Open Group Chat */}
            <div
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
            </div>
          </div>

          {conversations?.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
        <SidebarItem
          onClick={() => router.push('/')}
          icon={BsHouseFill}
          label='Domov'
        />
      </aside>
    </>
  )
}

export default AConversationList