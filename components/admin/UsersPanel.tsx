import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import { BsSearch } from 'react-icons/bs'
import axios from 'axios'

const UsersPanel = () => {
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [showAllUsers, setShowAllUsers] = useState(true)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const [query, setQuery] = useState('')

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
    const { data } = await axios.patch(`/api/users/${userId}`, {
      privilege,
      status: !status,
    })
    if (data === 'OK') {
      getUsers()
    }
  }

  const handleSearch = async (query) => {
    if (query === '') {
      setSearchResults([])
      setShowSearchResults(false)
      setShowAllUsers(true)
    } else {
      try {
        const response = await axios.get(`/api/search/users/${query}`)
        setSearchResults(response.data)
        setShowSearchResults(true)
        setShowAllUsers(false)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Užívatelia</h1>
      <div className='flex flex-row gap-2 justify-center items-center '>
        <input
          type='text'
          placeholder='Hľadať...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={() => handleSearch(query)}
          className='rounded-xl text-[#000000] pl-2'
        />
        <BsSearch
          className='cursor-pointer'
          onClick={() => handleSearch(query)}
        />
      </div>
      {showAllUsers && (
        <div className='flex flex-col gap-6 mt-8 ml-2'>
          {users.map((user: Record<string, any>) => (
            <div key={user.id} className='flex flex-col lg:flex-row gap-4'>
              <Avatar userId={user.id} />
              <div className='flex flex-col'>
                <p className='text-white font-semibold text-sm'>{user.name}</p>
                <p className='text-neutral-400 text-sm'>@{user.username}</p>
                <p className='text-neutral-400 text-sm'>{user.email}</p>
              </div>
              <div className='ml-0 lg:ml-auto mr-4 flex flex-col lg:flex-row justify-center gap-2 lg:gap-4 '>
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
                    messages?.filter((message) => user.id === message.senderId)
                      .length
                  }{' '}
                  Odoslaných správ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {searchResults && (
        <div className='flex flex-col gap-6 mt-8 ml-2'>
          {searchResults.map((user: Record<string, any>) => (
            <div key={user.id} className='flex flex-col lg:flex-row gap-4'>
              <Avatar userId={user.id} />
              <div className='flex flex-col'>
                <p className='text-white font-semibold text-sm'>{user.name}</p>
                <p className='text-neutral-400 text-sm'>@{user.username}</p>
                <p className='text-neutral-400 text-sm'>{user.email}</p>
              </div>
              <div className='ml-0 lg:ml-auto mr-4 flex flex-col lg:flex-row justify-center gap-2 lg:gap-4 '>
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
                    messages.filter((message) => message.senderId === user.id)
                      .length
                  }{' '}
                  Odoslaných správ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default UsersPanel
