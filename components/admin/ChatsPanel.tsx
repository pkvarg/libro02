import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BsSearch } from 'react-icons/bs'

const ChatsPanel = () => {
  const [chats, setChats] = useState([])
  const [showAllChats, setShowAllChats] = useState(true)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')

  const getChats = async () => {
    const { data } = await axios.get('/api/conversations/actions')
    setChats(data.conversations)
  }

  useEffect(() => {
    getChats()
  }, [])

  const handleSearch = async (query) => {
    if (query === '') {
      setSearchResults([])
      setShowAllChats(true)
      setShowSearchResults(false)
    } else {
      try {
        const response = await axios.get(`/api/search/tweets/${query}`)
        setSearchResults(response.data)
        setShowSearchResults(true)
        setShowAllChats(false)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Správy</h1>
      <div className='ml-2 mr-2'>
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
        {showAllChats && (
          <div className='mt-8'>
            {chats?.map((chat) =>
              chat.messages.map((message) => (
                <div
                  key={message.id}
                  className='flex flex-col lg:flex-row lg:gap-2 text-[20px] border-b-2 lg:border-0'
                >
                  <p className='text-[#FFAC1C]'>
                    {message.body}
                    {''}
                  </p>
                  <p> {message.sender.name}</p>
                </div>
              ))
            )}
          </div>
        )}
        {showSearchResults && (
          <div className='mt-8'>
            {searchResults?.map((chat) => (
              <div key={chat.id} className='flex flex-row gap-2 text-[20px]'>
                <p className='text-[#FFAC1C]'>
                  {chat.body}
                  {''}
                </p>
                <p> {chat?.user?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ChatsPanel
