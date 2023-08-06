import Header from '@/pages/conversations/components/Header'
import Body from '@/pages/conversations/components/Body'
import Form from '@/pages/conversations/components/Form'
import ConversationList from './components/ConversationList'
import AConversationList from './components/AConversationList'

import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import axios from 'axios'
import Sidebar from '@/components/layout/Sidebar'
import EmptyState from '@/pages/conversations/components/EmptyState'

// interface IParams {
//   conversationId: string
// }

const ChatId = () => {
  const [conversation, setConversation] = useState()
  const [messages, setMessages] = useState()

  const { isOpen } = useConversation()
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])

  const router = useRouter()
  const { conversationId } = router.query

  // Sidebar

  useEffect(() => {
    const getActions = async () => {
      const { data } = await axios.get('/api/conversations/actions')
      console.log('ddat:', data)

      setUsers(data.users)
      setConversations(data.conversations)
    }
    getActions()
  }, [])

  // getConversationById

  useEffect(() => {
    if (conversationId) {
      const getConversationById = async () => {
        const { data } = await axios.get(`/api/conversations/${conversationId}`)
        console.log('getCBId:', data)

        // setUsers(data.users)
        setConversation(data)
      }
      getConversationById()
    }
  }, [conversationId])

  console.log('conversation', conversation)

  // GetMessages

  useEffect(() => {
    if (conversationId) {
    }
    const getMessages = async () => {
      const { data } = await axios.get(`/api/messages/${conversationId}`)
      console.log('Mess:', data)

      setMessages(data)
    }
    getMessages()
  }, [conversationId])

  console.log('messages', messages)

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* <div className={clsx('h-full lg:block', isOpen ? 'block' : 'hidden')}> */}

      <div className={clsx('h-full lg:block')}>
        <ConversationList
          initialItems={conversations}
          users={users}
          title='Messages'
        />
        <div className='h-full mt-2'>
          <div className='h-full flex flex-col'>
            <Header conversation={conversation} />
            <Body initialMessages={messages} />
            <Form />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatId
