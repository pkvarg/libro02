'use client'

import ConversationList from '@/pages/conversations/components/ConversationList'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/conversations/components/EmptyState'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ably } from '@/libs/ably'

const Home = () => {
  const { isOpen } = useConversation()
  const session = useSession()
  const router = useRouter()

  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])


  const routeIsConversations = router.route.includes('conversations')

  useEffect(() => {
    const getActions = async () => {
      const { data } = await axios.get('/api/conversations/actions')
      if (data) {
        setUsers(data?.users)
        setConversations(data?.conversations)
      }
    }

    getActions()
  }, [])

  // realtime presence
  useEffect(() => {
    const doPresence = async () => {
      await ably.connection.once('connected')
      console.log('Connected to Ably!')
      const channel = ably.channels.get('chatroom')
      await channel.attach()
      await channel.presence.enter()
    }
    doPresence()
  }, [])

  return (
    <div className='flex h-[calc(100dvh-72px)] gap-4 pt-4 md:h-screen md:pb-4'>
      <ConversationList
        initialItems={conversations}
        users={users}
        title='Messages'
      />
      <div className='card hidden flex-1 md:flex'>
        <EmptyState />
      </div>
    </div>
  )
}

export default Home
