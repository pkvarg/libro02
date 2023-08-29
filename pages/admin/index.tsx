import React, { useState, useEffect } from 'react'
import getCurrentUser from '@/hooks/useCurrentUser'
import { useRouter } from 'next/router'
import UsersPanel from '@/components/admin/UsersPanel'
import BooksPanel from '@/components/admin/BooksPanel'
import TweetsPanel from '@/components/admin/TweetsPanel'
import ChatsPanel from '@/components/admin/ChatsPanel'

const AdminPage = () => {
  const { data } = getCurrentUser()
  const router = useRouter()

  const isAdmin = data?.isAdmin
  const name = data?.name

  const [showUsers, setShowUsers] = useState(false)
  const [showBooks, setShowBooks] = useState(false)
  const [showTweets, setShowTweets] = useState(false)
  const [showChats, setShowChats] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin])

  return (
    isAdmin && (
      <>
        <h1 className='text-center text-[30px] mt-2'>Hello {name}</h1>
        <div className='flex flex-row justify-center gap-2 mt-2'>
          <h2
            className='bg-[#09a7e9] rounded-xl px-2 cursor-pointer'
            onClick={() => setShowUsers((prev) => !prev)}
          >
            Užívatelia
          </h2>
          <h2
            className='bg-[#09a7e9] rounded-xl px-2 cursor-pointer'
            onClick={() => setShowBooks((prev) => !prev)}
          >
            Knihy
          </h2>
          <h2
            className='bg-[#09a7e9] rounded-xl px-2 cursor-pointer'
            onClick={() => setShowTweets((prev) => !prev)}
          >
            Tweety
          </h2>
          <h2
            className='bg-[#09a7e9] rounded-xl px-2 cursor-pointer'
            onClick={() => setShowChats((prev) => !prev)}
          >
            Chaty
          </h2>
        </div>
        <UsersPanel showUsers={showUsers} />
        <BooksPanel showBooks={showBooks} />
        <TweetsPanel showTweets={showTweets} />
        <ChatsPanel showChats={showChats} />
      </>
    )
  )
}

export default AdminPage
