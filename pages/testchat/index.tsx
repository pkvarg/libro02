import React from 'react'
import ChatInput from '@/components/testchatcomponents/ChatInput'
import ChatMessages from '@/components/testchatcomponents/ChatMessages'

const Home: React.FC = () => {
  return (
    <div>
      <h1>Simple Chat Example</h1>
      <ChatMessages />
      <ChatInput />
    </div>
  )
}

export default Home
