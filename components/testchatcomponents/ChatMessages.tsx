import React, { useEffect, useState } from 'react'
import { ably } from '@/libs/ably'

const ChatMessages: React.FC = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const channel = ably.channels.get('your-channel')

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message.data])
    }

    channel.subscribe('your-event', handleNewMessage)

    return () => {
      channel.unsubscribe('your-event', handleNewMessage)
      //ably.close()
    }
  }, [])

  return (
    <ul>
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  )
}

export default ChatMessages
