import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ChatsPanel = ({ showChats }) => {
  const [chats, setChats] = useState([])

  const getChats = async () => {
    const { data } = await axios.get('/api/conversations/actions')
    console.log(data.conversations)
    setChats(data.conversations)
  }

  useEffect(() => {
    getChats()
  }, [])
  return (
    showChats && (
      <>
        <h1 className='text-center text-[30px] my-8 '>Správy</h1>
        <div>
          {/* {chats.map((chat) => (
            <p key={chat.id}>{chat.body}</p>
          ))} */}
          {chats?.map((chat) =>
            chat.messages.map((message) => (
              <p key={message.id}>{message.body}</p>
            ))
          )}
        </div>
      </>
    )
  )
}

export default ChatsPanel
