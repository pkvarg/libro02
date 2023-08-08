'use client'

import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

// import { pusherClient } from '@/app/libs/pusher'
import { useRouter } from 'next/router'

import MessageBox from './MessageBox'
import { FullMessageType } from '@/types'
import { find } from 'lodash'

// interface BodyProps {
//   initialMessages: FullMessageType[]
// }

const Body = () => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<any[]>([])

  const router = useRouter()
  const { conversationId } = router.query

  console.log('Boody', messages)

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

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  // useEffect(() => {
  //   pusherClient.subscribe(conversationId)
  //   bottomRef?.current?.scrollIntoView()

  //   const messageHandler = (message: FullMessageType) => {
  //     axios.post(`/api/conversations/${conversationId}/seen`)

  //     setMessages((current) => {
  //       if (find(current, { id: message.id })) {
  //         return current
  //       }

  //       return [...current, message]
  //     })

  //     bottomRef?.current?.scrollIntoView()
  //   }

  //   const updateMessageHandler = (newMessage: FullMessageType) => {
  //     setMessages((current) =>
  //       current.map((currentMessage) => {
  //         if (currentMessage.id === newMessage.id) {
  //           return newMessage
  //         }

  //         return currentMessage
  //       })
  //     )
  //   }

  //   pusherClient.bind('messages:new', messageHandler)
  //   pusherClient.bind('message:update', updateMessageHandler)

  //   return () => {
  //     pusherClient.unsubscribe(conversationId)
  //     pusherClient.unbind('messages:new', messageHandler)
  //     pusherClient.unbind('message:update', updateMessageHandler)
  //   }
  // }, [conversationId])

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
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
