import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

import { AdminSearch, StatusToggle } from './AdminUi'

const TweetsPanel = () => {
  const [tweets, setTweets] = useState([])
  const [showAllTweets, setShowAllTweets] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')

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
      if (!showAllTweets) handleSearch(query)
    }
  }

  useEffect(() => {
    getTweets()
  }, [])

  const handleSearch = async (query: string) => {
    setQuery(query)
    if (query === '') {
      setSearchResults([])
      setShowAllTweets(true)
    } else {
      try {
        const response = await axios.get(`/api/search/tweets/${encodeURIComponent(query)}`)
        setSearchResults(response.data)
        setShowAllTweets(false)
      } catch (error) {
        console.error('Error searching:', error)
      }
    }
  }

  const list = showAllTweets ? tweets : searchResults

  return (
    <section className="flex flex-col gap-4">
      <AdminSearch value={query} onChange={handleSearch} />
      <div className="card divide-y divide-line">
        {list.map((tweet) => (
          <div key={tweet.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <Link href={`/posts/${tweet.id}`} className="focus-ring block rounded text-ink hover:underline">
                {tweet.body}
              </Link>
              {tweet?.user && (
                <Link href={`/users/${tweet.user.id}`} className="link text-sm">
                  {tweet.user.name}
                </Link>
              )}
            </div>
            <StatusToggle label="Aktívny" on={!!tweet.active} onClick={() => toggleTweetStatus(tweet.id, tweet.active)} />
          </div>
        ))}
        {list.length === 0 && <p className="p-6 text-center text-ink-muted">Nič sa nenašlo.</p>}
      </div>
    </section>
  )
}

export default TweetsPanel
