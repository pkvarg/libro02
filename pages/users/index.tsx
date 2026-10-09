import React from 'react'

import useUsers from '@/hooks/useUsers'
import useCurrentUser from '@/hooks/useCurrentUser'

import Header from '@/components/Header'
import UserCard from '@/components/users/UserCard'

const Members = () => {
  const { data: users = [] } = useUsers()
  const { data: currentUser } = useCurrentUser()

  if (!currentUser) {
    return null
  }

  const others = users.filter((user: Record<string, any>) => user.id !== currentUser?.id)

  return (
    <>
      <Header showBackArrow label="Členovia" />
      <div className="card p-2">
        {others.length === 0 ? (
          <p className="p-6 text-center text-ink-muted">Zatiaľ tu nie sú ďalší členovia.</p>
        ) : (
          others.map((user: Record<string, any>) => (
            <UserCard key={user.id} user={user as any} showBio showChat showFollow />
          ))
        )}
      </div>
    </>
  )
}

export default Members
