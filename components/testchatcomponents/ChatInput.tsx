import React, { useState } from 'react'
import { ably } from '@/libs/ably'

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const channel = ably.channels.get('your-channel')
    await channel.publish('your-event', message)

    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='text-gray-700 text-[30px]'
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Type your message...'
      />
      <button type='submit'>Send</button>
    </form>
  )
}

export default ChatInput
