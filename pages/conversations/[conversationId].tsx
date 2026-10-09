'use client'
import Header from '@/pages/conversations/components/Header'
import Body from '@/pages/conversations/components/Body'
import Form from '@/pages/conversations/components/Form'
import ConversationList from '@/pages/conversations/components/ConversationList'
import useConversation from '@/hooks/useConversation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import EmptyState from '@/pages/conversations/components/EmptyState'
import LoadingModal from '@/pages/conversations/components/LoadingModal'
import { ably, refreshAblyToken } from '@/libs/ably'

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

  const [key, setKey] = useState(0)

  const rerender = () => {
    setKey((prevKey) => prevKey + 1)
    console.log('set', key)
  }

  useEffect(() => {
    if (conversationId) {
      const getMessages = async () => {
        const { data } = await axios.get(`/api/messages/${conversationId}`)
        setMessages(data)
      }

      const channel = ably.channels.get(conversationId.toString())
      refreshAblyToken().then(() => channel.subscribe('your-event', getMessages))

      getMessages()
    }
  }, [conversationId, key])

  // Sidebar
  // if messages and conversations change, update conversations in Sidebar

  useEffect(() => {
    setIsloading(true)
    const getActions = async () => {
      const { data } = await axios.get('/api/conversations/actions')

      setUsers(data.users)
      setConversations(data.conversations)
      setIsloading(false)
    }
    // On a hard reload the id is not known yet on the first render.
    if (conversationId) {
      const channel = ably.channels.get(conversationId.toString())
      refreshAblyToken().then(() => channel.subscribe('your-event', getActions))
    }

    getActions()
  }, [conversationId, message, key])

  // getConversationById

  useEffect(() => {
    if (conversationId) {
      setIsloading(true)

      const getConversationById = async () => {
        const { data } = await axios.get(`/api/conversations/${conversationId}`)
        setConversation(data)
        setIsloading(false)
      }
      getConversationById()
    }
  }, [conversationId])

  if (!conversation) {
    return (
      <div className='flex h-[100dvh] gap-4 md:h-screen md:py-4'>
        <div className='card flex flex-1'>
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingModal />}
      <div className='-mx-4 flex h-[100dvh] gap-4 md:mx-0 md:h-screen md:py-4'>
        <ConversationList
          initialItems={conversations}
          users={users}
          title='Messages'
        />
        <section className='fixed inset-0 z-40 flex min-w-0 flex-1 flex-col overflow-hidden bg-surface md:static md:z-auto md:rounded-card md:border md:border-line md:shadow-card'>
          <Header conversation={conversation} />
          <Body initialMessages={messages} rerender={rerender} />
          <Form message={message} setMessage={setMessage} />
        </section>
      </div>
    </>
  )
}

export default ChatId
