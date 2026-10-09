import React, { useState, useEffect } from 'react'
import getCurrentUser from '@/hooks/useCurrentUser'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import UsersPanel from '@/components/admin/UsersPanel'
import BooksPanel from '@/components/admin/BooksPanel'
import TweetsPanel from '@/components/admin/TweetsPanel'
import Counter from '@/components/admin/Counter'

const AdminPage = () => {
  const { data, isLoading: isUserLoading } = getCurrentUser()
  const router = useRouter()

  const isAdmin = data?.isAdmin
  const name = data?.name

  // One active panel at a time; the chat panel is disabled.
  const [tab, setTab] = useState<'users' | 'books' | 'tweets'>('users')

  // Wait until the current user has loaded, otherwise a hard reload always redirects.
  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, isUserLoading])

  const tabs = [
    { label: 'Užívatelia', active: tab === 'users', open: () => setTab('users') },
    { label: 'Knihy', active: tab === 'books', open: () => setTab('books') },
    { label: 'Príspevky', active: tab === 'tweets', open: () => setTab('tweets') },
  ]

  return (
    isAdmin && (
      <div className="mx-auto min-h-screen max-w-3xl pt-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Administrácia</h1>
        <p className="text-sm text-ink-muted">Prihlásený: {name}</p>
        <div className="mt-4 flex gap-1 overflow-x-auto rounded-full bg-sunken p-1" role="tablist">
          {tabs.map((item) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={item.active}
              onClick={item.open}
              className={clsx(
                'focus-ring flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                item.active ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Counter />
        <div className="mt-4">
          {tab === 'users' && <UsersPanel />}
          {tab === 'books' && <BooksPanel />}
          {tab === 'tweets' && <TweetsPanel />}
        </div>
      </div>
    )
  )
}

export default AdminPage
