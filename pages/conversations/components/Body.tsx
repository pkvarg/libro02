'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'
import { FullMessageType } from './../../../types'
import axios from 'axios'

interface BodyProps {
  initialMessages: FullMessageType[]
  rerender: () => void
}

const Body: React.FC<BodyProps> = ({ initialMessages, rerender }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(initialMessages)

  const router = useRouter()
  const { conversationId } = router.query

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  // Scroll only the message list, never the page around it.
  useEffect(() => {
    const list = scrollRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [initialMessages])

  return (
    <div ref={scrollRef} className='flex-1 overflow-y-auto bg-paper/40 py-3'>
      {initialMessages?.map((message, i) => (
        <MessageBox
          isLast={i === initialMessages.length - 1}
          key={message.id}
          data={message}
          rerender={rerender}
        />
      ))}
    </div>
  )
}

export default Body
