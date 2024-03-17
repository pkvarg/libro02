import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BsSearch } from 'react-icons/bs'

import { useRouter } from 'next/router'

const TweetsPanel = () => {
  const [tweets, setTweets] = useState([])
  const [showAllTweets, setShowAllTweets] = useState(true)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')
  const router = useRouter()

  const getTweets = async () => {
    const { data } = await axios.get('/api/posts')
    setTweets(data)
  }

  const toggleTweetStatus = async (tweetId: string, status: boolean) => {
    const { data } = await axios.patch(`/api/posts/${tweetId}`, {
      status: !status,
    })
    if (data === 'OK') {
      getTweets()
    }
  }

  useEffect(() => {
    getTweets()
  }, [])

  const handleSearch = async (query) => {
    if (query === '') {
      setSearchResults([])
      setShowAllTweets(true)
      setShowSearchResults(false)
    } else {
      try {
        const response = await axios.get(`/api/search/tweets/${query}`)
        setSearchResults(response.data)
        setShowSearchResults(true)
        setShowAllTweets(false)
        console.log(response.data)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Tweety</h1>
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
      {showAllTweets && (
        <div className='mt-8'>
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className='flex flex-col lg:flex-row gap-2 text-[25px] mx-2 mt-4 lg:mt-0 border-b-2 lg:border-0'
            >
              <p className='text-[#FFAC1C]'>{tweet.body}</p>
              <p
                className='cursor-pointer'
                onClick={() => router.push(`/users/${tweet.user.id}`)}
              >
                {tweet.user.name}
              </p>
              <p
                className={
                  tweet.active
                    ? `ml-0 lg:ml-auto mr-2 text-[#00FF00] cursor-pointer`
                    : `ml-0 lg:ml-auto mr-2 text-[#D2042D] cursor-pointer `
                }
                onClick={() => toggleTweetStatus(tweet.id, tweet.active)}
              >
                Aktívny
              </p>
            </div>
          ))}
        </div>
      )}
      {showSearchResults && (
        <div className='mt-8'>
          {searchResults.map((tweet) => (
            <div
              key={tweet.id}
              className='flex flex-col lg:flex-row gap-2 text-[25px] mx-2 mt-8 lg:mt-0 border-b-2 lg:border-0'
            >
              <p className='text-[#FFAC1C]'>{tweet.body}</p>
              <p
                className='cursor-pointer'
                onClick={() => router.push(`/users/${tweet.user.id}`)}
              >
                {tweet?.user?.name}
              </p>
              <p
                className={
                  tweet.active
                    ? `ml-0 lg:ml-auto mr-2 text-[#00FF00] cursor-pointer`
                    : `ml-0 lg:ml-auto mr-2 text-[#D2042D] cursor-pointer `
                }
                onClick={() => toggleTweetStatus(tweet.id, tweet.active)}
              >
                Aktívny
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default TweetsPanel
