import Header from '@/pages/conversations/components/Header'
import Body from '@/pages/conversations/components/Body'
import Form from '@/pages/conversations/components/Form'
import ConversationList from './components/ConversationList'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Sidebar from '@/components/layout/Sidebar'
import EmptyState from '@/pages/conversations/components/EmptyState'
import LoadingModal from './components/LoadingModal'
import { useSocket } from '@/components/providers/SocketProvider'

// interface IParams {
//   conversationId: string
// }

const ChatId = () => {
  const [conversation, setConversation] = useState()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const { isOpen } = useConversation()
  const { socket } = useSocket()
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [usersInConversation, setUsersInConversation] = useState([])
  const [msgSent, setMsgSent] = useState(false)
  const [msgReceived, setMsgReceived] = useState(false)
  const session = useSession()
  const currentUserEmail = session.data?.user?.email

  const router = useRouter()
  const { conversationId } = router.query

  const [isLoading, setIsloading] = useState(false)

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(`/api/messages/${conversationId}`)
      setMessages(data)
    }

    //getMessages()
    // socket.on('receiveMessage', (msg, convId) => {
    //   if (conversationId === convId) {
    //     getMessages()
    //   }
    // })
    // socket.on('sendMessage', (msg, convId) => {
    //   if (conversationId === convId) {
    //     getMessages()
    //   }
    // })
  }, [conversationId, socket])

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
    // socket.on('receiveMessage', (msg, convId) => {
    //   getActions()
    // })
    // socket.on('sendMessage', (msg, convId) => {
    //   getActions()
    // })
    getActions()
  }, [conversationId, message, socket])

  // getConversationById

  useEffect(() => {
    if (conversationId) {
      setIsloading(true)

      const getConversationById = async () => {
        const { data } = await axios.get(`/api/conversations/${conversationId}`)
        setConversation(data)
        // setUsersInConversation(data?.users?.map((user) => user.id))
        // console.log(data)
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
            <Body
              // messages={messages}
              // setMessages={setMessages}
              message={message}
            />
            <Form message={message} setMessage={setMessage} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatId
