'use client'
import Header from '@/pages/newconversations/components/Header'
import Body from '@/pages/newconversations/components/Body'
import Form from '@/pages/newconversations/components/Form'
import ConversationList from '@/pages/newconversations/components/ConversationList'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import EmptyState from '@/pages/newconversations/components/EmptyState'
import LoadingModal from '@/pages/newconversations/components/LoadingModal'
import { ably } from '@/libs/ably'

const ChatId = () => {
  const router = useRouter()
  const { conversationId } = router.query
  const [conversation, setConversation] = useState()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const { isOpen } = useConversation()
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const session = useSession()

  const [isLoading, setIsloading] = useState(false)

  useEffect(() => {
    if (conversationId) {
      const getMessages = async () => {
        const { data } = await axios.get(`/api/newmessages/${conversationId}`)
        setMessages(data)
      }

      const channel = ably.channels.get(conversationId.toString())
      channel.subscribe('your-event', getMessages)

      getMessages()
    }
  }, [conversationId])

  // Sidebar
  // if messages and conversations change, update conversations in Sidebar

  useEffect(() => {
    setIsloading(true)
    const getActions = async () => {
      const { data } = await axios.get('/api/newconversations/actions')

      setUsers(data.users)
      setConversations(data.conversations)
      setIsloading(false)
    }
    const channel = ably.channels.get(conversationId?.toString())
    channel.subscribe('your-event', getActions)

    getActions()
  }, [conversationId, message])

  // getConversationById

  useEffect(() => {
    if (conversationId) {
      setIsloading(true)

      const getConversationById = async () => {
        const { data } = await axios.get(
          `/api/newconversations/${conversationId}`
        )
        setConversation(data)
        setIsloading(false)
      }
      getConversationById()
    }
  }, [conversationId])

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
      {isLoading && <LoadingModal />}
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
            <Form message={message} setMessage={setMessage} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatId
