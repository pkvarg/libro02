'use client'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'
import { FullMessageType } from './../../../types'
import { find } from 'lodash'
import { useSocket } from '../../../components/providers/SocketProvider'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState([])

  const router = useRouter()
  const { conversationId } = router.query
  const { socketInstance } = useSocket()

  let messArray = []

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    setMessages(initialMessages)

    socketInstance.on('update-input', (message: FullMessageType) => {
      setMessages((current) => [...current, message])
      console.log('bdeeef1', message)

      bottomRef?.current?.scrollIntoView()
    })
    // pusherClient.subscribe(conversationId)
    // bottomRef?.current?.scrollIntoView()

    // const messageHandler = (message: FullMessageType) => {
    //   axios.post(`/api/conversations/${conversationId}/seen`)

    //   setMessages((current) => {
    //     if (find(current, { id: message.id })) {
    //       return current
    //     }

    //     return [...current, message]
    //   })

    //   bottomRef?.current?.scrollIntoView()
    // }

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

    // msg musi byt presny obj z db

    // socketInstance.on('input-change', (msg) => {
    //   console.log('bdef2', msg.body)
    // })

    //pusherClient.bind('message:update', updateMessageHandler)

    // pusherClient.bind('messages:new', messageHandler)
    // pusherClient.bind('message:update', updateMessageHandler)

    // return () => {
    //   pusherClient.unsubscribe(conversationId)
    //   pusherClient.unbind('messages:new', messageHandler)
    //   pusherClient.unbind('message:update', updateMessageHandler)
    // }
  }, [conversationId, socketInstance])

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
