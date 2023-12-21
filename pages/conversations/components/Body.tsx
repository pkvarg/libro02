'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'
import { FullMessageType } from './../../../types'

interface BodyProps {
  initialMessages: FullMessageType[]
  rerender: () => void
}

const Body: React.FC<BodyProps> = ({ initialMessages, rerender }) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(initialMessages)

  const router = useRouter()
  const { conversationId } = router.query

  useEffect(() => {
    bottomRef?.current?.scrollIntoView()
  }, [initialMessages])

  return (
    <div className='flex-1 overflow-y-auto'>
      {initialMessages?.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          rerender={rerender}
        />
      ))}
      <div className='pt-24' ref={bottomRef} />
    </div>
  )
}

export default Body
