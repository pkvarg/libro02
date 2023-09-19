'use client'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'
import { FullMessageType } from '@/types'
import { find } from 'lodash'
import { useSocket } from '@/components/providers/SocketProvider'

const Body = ({ message }) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { socket } = useSocket()
  const { conversationId } = router.query
  const [connected, isConnected] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(`/api/messages/${conversationId}`)
      setMessages(data)
    }
    getMessages()
    socket.on('receiveMessage', (msg, convId) => {
      getMessages()
    })
    socket.on('sendMessage', (msg, convId) => {
      getMessages()
    })
  }, [conversationId, socket, message])

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current
        }

        return [...current, message]
      })

      bottomRef?.current?.scrollIntoView()
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage
          }

          return currentMessage
        })
      )
    }
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
      <div className='pt-24' ref={bottomRef} />
    </div>
  )
}

export default Body
