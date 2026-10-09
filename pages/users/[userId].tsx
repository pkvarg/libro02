import { useState } from 'react'
import { useRouter } from 'next/router'
import { ClipLoader } from 'react-spinners'
import clsx from 'clsx'

import useUser from '@/hooks/useUser'

import PostFeed from '@/components/posts/PostFeed'
import BookFeed from '@/components/posts/BookFeed'
import Header from '@/components/Header'
import UserBio from '@/components/users/UserBio'
import UserHero from '@/components/users/UserHero'

const tabs = [
  { key: 'books', label: 'Knihy' },
  { key: 'posts', label: 'Príspevky' },
] as const

const UserView = () => {
  const router = useRouter()
  const { userId } = router.query
  const [tab, setTab] = useState<'books' | 'posts'>('books')

  const { data: fetchedUser, isLoading } = useUser(userId as string)

  if (isLoading || !fetchedUser) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <ClipLoader color='#7C2D3A' size={40} />
      </div>
    )
  }

  return (
    <>
      <Header showBackArrow label={fetchedUser?.name} />
      <section className='card'>
        <UserHero userId={userId as string} />
        <UserBio userId={userId as string} />
      </section>
      <div className='sticky top-14 z-20 -mx-4 mb-3 mt-4 border-b border-line bg-paper/90 px-4 backdrop-blur md:mx-0 md:px-0' role='tablist'>
        <div className='flex gap-6'>
          {tabs.map((item) => (
            <button
              key={item.key}
              type='button'
              role='tab'
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={clsx(
                'focus-ring -mb-px border-b-2 py-3 text-sm font-semibold transition-colors',
                tab === item.key ? 'border-brand text-ink' : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {tab === 'books' ? <BookFeed userId={userId as string} /> : <PostFeed userId={userId as string} />}
    </>
  )
}

export default UserView
