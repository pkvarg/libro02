'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'
import useCurrentUser from '@/hooks/useCurrentUser'
import clsx from 'clsx'
import AvatarChat from '@/components/AvatarChat'
import useOtherUser from '@/hooks/useOtherUser'
import AvatarGroup from '@/components/AvatarGroup'
import { FullConversationType } from '@/types'

interface ConversationBoxProps {
  data: FullConversationType
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data)
  const router = useRouter()

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data, router])

  const lastMessage = useMemo(() => {
    const messages = data?.messages || [] || undefined

    return messages[messages.length - 1]
  }, [data?.messages])

  const { data: currentUser } = useCurrentUser()
  const userId = currentUser?.id

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false
    }

    const seenArray = lastMessage.seen || []

    if (!userId) {
      return false
    }

    return seenArray.filter((user) => user.id === userId).length !== 0
  }, [userId, lastMessage])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Poslaný obrázok'
    }

    if (lastMessage?.body) {
      return lastMessage?.body
    }

    return 'Začatá konverzácia'
  }, [lastMessage])

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-current={selected ? 'page' : undefined}
      className={clsx(
        'focus-ring flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors',
        selected ? 'bg-brand-soft' : 'hover:bg-sunken'
      )}
    >
      {data?.isGroup ? <AvatarGroup users={data?.users} /> : <AvatarChat user={otherUser} />}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-semibold text-ink">{data?.name || otherUser?.name}</p>
          {lastMessage?.createdAt && (
            <p className="shrink-0 text-xs text-ink-muted">{format(new Date(lastMessage.createdAt), 'p', { locale: sk })}</p>
          )}
        </div>
        <p className={clsx('truncate text-sm', hasSeen ? 'text-ink-muted' : 'font-semibold text-ink')}>
          {lastMessageText}
        </p>
      </div>
      {!hasSeen && lastMessage && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand" aria-label="Neprečítané" />}
    </button>
  )
}

export default ConversationBox
