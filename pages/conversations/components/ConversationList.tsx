'use client'

import { User } from '@prisma/client'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import ConversationBox from './ConversationBox'
import { FullConversationType } from '@/types'

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
  title?: string
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems }) => {
  const { conversationId, isOpen } = useConversation()

  return (
    <aside
      className={clsx(
        'card w-full shrink-0 flex-col overflow-hidden md:flex md:w-80',
        isOpen ? 'hidden' : 'flex'
      )}
      aria-label="Konverzácie"
    >
      <h1 className="page-title border-b border-line px-5 py-4">Správy</h1>
      <div className="flex-1 overflow-y-auto p-2">
        {initialItems?.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-muted">
            Zatiaľ žiadne konverzácie. Napíšte členovi z jeho profilu alebo cez tlačidlo Kontakt pri knihe.
          </p>
        )}
        {initialItems?.map((item) => (
          <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
        ))}
      </div>
    </aside>
  )
}

export default ConversationList
