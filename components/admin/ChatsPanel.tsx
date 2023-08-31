import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ChatsPanel = () => {
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
    <>
      <h1 className='text-center text-[30px] my-8 '>Správy</h1>
      <div>
        {/* {chats.map((chat) => (
            <p key={chat.id}>{chat.body}</p>
          ))} */}
        {chats?.map((chat) =>
          chat.messages.map((message) => (
            <div key={message.id} className='flex flex-row gap-2 text-[20px]'>
              <p className='text-[#FFAC1C]'>
                {message.body}
                {''}
              </p>
              <p> {message.sender.name}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default ChatsPanel
