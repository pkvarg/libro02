'use client'
import Header from '@/pages/conversations/components/Header'
import Form from '@/pages/conversations/components/Form'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import EmptyState from '@/pages/conversations/components/EmptyState'
import LoadingModal from './components/LoadingModal'
import MessageBox from './components/MessageBox'
import { useSocket } from '@/components/providers/SocketProvider'
import ConversationBox from './../conversations/components/ConversationBox'
import SidebarItem from '@/components/layout/SidebarItem'
import { BsHouseFill } from 'react-icons/bs'

const ChatId = () => {
  const router = useRouter()
  const { conversationId } = router.query
  const { socketInstance, isConnected } = useSocket()
  const [conversation, setConversation] = useState()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const { isOpen } = useConversation()
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsloading] = useState(false)
  //from Convlist
  const [status, setStatus] = useState('Offline')

  useEffect(() => {
    if (isConnected) {
      setStatus('Live')
    } else {
      setStatus('Offline')
    }
  }, [isConnected])

  // set messages from db
  useEffect(() => {
    if (conversationId) {
      const getMessages = async () => {
        const { data } = await axios.get(`/api/messages/${conversationId}`)
        setMessages(data)
      }

      getMessages()
      socketInstance.on('input-change', (msg) => {
        console.log('send')

        getMessages()
      })
      socketInstance.on('update-input', (msg) => {
        console.log('update')
        getMessages()
      })
    }
  }, [conversationId])

  //scroll up on message
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
      })
    }, 2110)
  }, [conversationId, socketInstance])

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
    socketInstance.on('update-input', (msg) => {
      getActions()
    })
    getActions()
  }, [conversationId, message])

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
                <p
                  className={
                    status === 'Offline'
                      ? `bg-yellow-600 text-white border-none px-2`
                      : `bg-emerald-600 text-white border-none px-2 `
                  }
                >
                  {status}
                </p>
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
          <div className='ml-6'>
            <SidebarItem
              onClick={() => router.push('/')}
              icon={BsHouseFill}
              label='Domov'
            />
          </div>
        </aside>

        <div className='h-full mt-2'>
          <div className='h-full flex flex-col'>
            <Header conversation={conversation} />

            <div className='flex-1 overflow-y-auto'>
              {messages?.map(
                (message, i) =>
                  message.conversationId === conversationId && (
                    <MessageBox
                      isLast={i === messages.length - 1}
                      key={message.id}
                      data={message}
                    />
                  )
              )}
            </div>
            <Form />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatId
