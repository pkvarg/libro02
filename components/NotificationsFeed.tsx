import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { sk } from 'date-fns/locale'
import { HiHeart, HiUserPlus } from 'react-icons/hi2'

import { useNotifications, useFollowingNotifications } from '@/hooks/useNotifications'
import useCurrentUser from '@/hooks/useCurrentUser'

import Avatar from './Avatar'

interface FeedEntry {
  id: string
  actorId?: string
  photo?: string | null
  body: string
  detail?: string
  href?: string
  kind: 'like' | 'follow'
  createdAt?: string
}

const NotificationsFeed = () => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser()
  const { data: fetchedNotifications = [] } = useNotifications(currentUser?.id)
  const { data: fetchedFollowingNotifications = [] } = useFollowingNotifications(currentUser?.id)

  useEffect(() => {
    mutateCurrentUser()
  }, [mutateCurrentUser])

  // Likes open the post, new followers open their profile.
  const entries = useMemo<FeedEntry[]>(() => {
    const likes = fetchedNotifications.map((notification: Record<string, any>) => ({
      id: notification.id,
      actorId: notification.liker,
      body: notification.body,
      detail: notification.postBody,
      href: notification.postId ? `/posts/${notification.postId}` : undefined,
      kind: 'like' as const,
      createdAt: notification.createdAt,
    }))
    const follows = fetchedFollowingNotifications.map((notification: Record<string, any>) => ({
      id: notification.id,
      actorId: notification.follower,
      body: notification.body,
      href: notification.follower ? `/users/${notification.follower}` : undefined,
      kind: 'follow' as const,
      createdAt: notification.createdAt,
    }))
    return [...likes, ...follows].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
  }, [fetchedNotifications, fetchedFollowingNotifications])

  if (entries.length === 0) {
    return <p className="card p-6 text-center text-ink-muted">Žiadne notifikácie</p>
  }

  return (
    <div className="card divide-y divide-line overflow-hidden">
      {entries.map((entry) => {
        const Icon = entry.kind === 'like' ? HiHeart : HiUserPlus
        return (
          <div key={entry.id} className="relative flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-sunken sm:px-5">
            {entry.href && (
              <Link href={entry.href} className="focus-ring absolute inset-0" aria-label={entry.body} />
            )}
            <div className="relative z-10">
              {entry.actorId ? <Avatar userId={entry.actorId} size="md" /> : null}
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-brand ring-2 ring-surface">
                <Icon size={14} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-ink">{entry.body}</p>
              {entry.detail && <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{entry.detail}</p>}
              {entry.createdAt && (
                <p className="mt-1 text-xs text-ink-faint">
                  {formatDistanceToNowStrict(new Date(entry.createdAt), { locale: sk, addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationsFeed
