'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'
import { FullMessageType } from './../../../types'
import { find } from 'lodash'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(initialMessages)

  const router = useRouter()
  const { conversationId } = router.query

  // useEffect(() => {
  //   axios.post(`/api/conversations/${conversationId}/seen`)
  // }, [conversationId])

  useEffect(() => {
    bottomRef?.current?.scrollIntoView()

    const messageHandler = (message: FullMessageType) => {
      // axios.post(`/api/conversations/${conversationId}/seen`)

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
