'use client'
import axios from 'axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import MessageBox from './MessageBox'

const Body = ({ message, messages, setMessages }) => {
  const router = useRouter()
  const { conversationId } = router.query

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
