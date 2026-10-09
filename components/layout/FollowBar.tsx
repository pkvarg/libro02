import React from 'react'
import Link from 'next/link'

import useUsers from '@/hooks/useUsers'
import useCurrentUser from '@/hooks/useCurrentUser'

import UserCard from '../users/UserCard'

const VISIBLE = 8

const FollowBar = () => {
  const { data: users = [] } = useUsers()
  const { data: currentUser } = useCurrentUser()

  if (!currentUser || users.length === 0) {
    return null
  }

  const others = users.filter((user: Record<string, any>) => user.id !== currentUser.id)

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto py-4 xl:block">
      <div className="card p-3">
        <h2 className="px-2.5 pb-1 pt-1 font-display text-lg font-semibold text-ink">Členovia</h2>
        <div className="flex flex-col">
          {others.slice(0, VISIBLE).map((user: Record<string, any>) => (
            <UserCard key={user.id} user={user as any} showChat />
          ))}
        </div>
        {others.length > VISIBLE && (
          <Link href="/users" className="link mt-1 block px-2.5 py-2 text-sm">
            Zobraziť všetkých ({others.length})
          </Link>
        )}
      </div>
    </aside>
  )
}

export default FollowBar
