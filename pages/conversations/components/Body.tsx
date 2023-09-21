'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'
import { useSocket } from '@/components/providers/SocketProvider'

const Body = ({ message, messages, setMessages }) => {
  const router = useRouter()
  const { socket, received } = useSocket()
  const { conversationId } = router.query
  const [connected, isConnected] = useState(false)
  // const [messages, setMessages] = useState([])

  // useEffect(() => {
  //   if (conversationId !== undefined) {
  //     const getMessages = async () => {
  //       const { data } = await axios.get(`/api/messages/${conversationId}`)
  //       setMessages(data)
  //     }

  //     getMessages()
  //   }
  // }, [conversationId, socket, message, received])

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages?.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
    </div>
  )
}

export default Body
