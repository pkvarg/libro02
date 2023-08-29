import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import axios from 'axios'

const UsersPanel = () => {
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])

  const getUsers = async () => {
    const { data } = await axios.get('/api/users')
    setUsers(data)
  }

  const getBooks = async () => {
    const { data } = await axios.get('/api/books')
    setBooks(data)
  }

  const getConversations = async () => {
    const { data } = await axios.get('/api/conversations/actions')
    setConversations(data.conversations)
  }

  const getMessages = async () => {
    const { data } = await axios.get('/api/messages')
    setMessages(data)
  }

  useEffect(() => {
    getUsers()
    getBooks()
    getConversations()
    getMessages()
  }, [])

  const conv = conversations?.filter((conversation) =>
    conversation.userIds.map((id) => id === '64a3e98b5343db0e444ee0fa')
  )

  const msgs = messages.filter(
    (message) => message.senderId === '64a3e98b5343db0e444ee0fa'
  )

  const toggleUserPrivileges = async (
    userId: string,
    privilege: string,
    status: boolean
  ) => {
    console.log(userId, privilege, status)
    const { data } = await axios.patch(`/api/users/${userId}`, {
      privilege,
      status: !status,
    })
    console.log(data)
    if (data === 'OK') {
      getUsers()
    }
  }

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Užívatelia</h1>
      <div className='flex flex-col gap-6 mt-4 ml-2'>
        {users.map((user: Record<string, any>) => (
          <div key={user.id} className='flex flex-row gap-4'>
            <Avatar userId={user.id} />
            <div className='flex flex-col'>
              <p className='text-white font-semibold text-sm'>{user.name}</p>
              <p className='text-neutral-400 text-sm'>@{user.username}</p>
            </div>
            <div className='ml-auto mr-4 flex flex-row justify-center gap-4 '>
              <p
                className={
                  user.isAdmin
                    ? `text-[#00FF00] font-semibold cursor-pointer `
                    : `text-[#D2042D] font-semibold  cursor-pointer`
                }
                onClick={() =>
                  toggleUserPrivileges(user.id, 'isAdmin', user.isAdmin)
                }
              >
                Admin
              </p>
              <p
                className={
                  user.active
                    ? `text-[#00FF00] font-semibold  cursor-pointer`
                    : `text-[#D2042D] font-semibold  cursor-pointer`
                }
                onClick={() =>
                  toggleUserPrivileges(user.id, 'active', user.active)
                }
              >
                Aktívny
              </p>
            </div>
            <div className='mr-2 text-[#FFAC1C]'>
              <p>
                {books?.filter((book) => user.id === book.userId).length} kníh
              </p>
              {/* <p>
                {
                  conversations?.filter((conversation) =>
                    conversation.userIds.map(
                      (id) => id === '64a3e98b5343db0e444ee0fa'
                    )
                  ).length
                }
                konverzácií
              </p> */}
              <p>
                {
                  messages.filter(
                    (message) => message.senderId === '64a3e98b5343db0e444ee0fa'
                  ).length
                }{' '}
                Odoslaných správ
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default UsersPanel
