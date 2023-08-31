import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const TweetsPanel = () => {
  const [tweets, setTweets] = useState([])
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

  return (
    <>
      <h1 className='text-center text-[30px] my-8 '>Tweety</h1>
      <div>
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
    </>
  )
}

export default TweetsPanel
