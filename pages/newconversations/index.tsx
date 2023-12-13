'use client'

import ConversationList from '@/pages/newconversations/components/ConversationList'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/newconversations/components/EmptyState'
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

  const currentUserEmail = session.data?.user?.email

  const routeIsConversations = router.route.includes('newconversations')

  useEffect(() => {
    const getActions = async () => {
      const { data } = await axios.get('/api/newconversations/actions')
      if (data) {
        setUsers(data?.users)
        setConversations(data?.conversations)
      }
    }

    getActions()
  }, [])

  // useEffect(() => {
  //   const channel = ably.channels.get('presenting')
  //   channel.presence.subscribe('enter', (member) => {
  //     console.log('member entered', member)
  //   })
  // }, [])

  return (
    <div className={clsx('h-full  lg:block')}>
      <ConversationList
        initialItems={conversations}
        users={users}
        title='Messages'
      />
      <EmptyState />
    </div>
  )
}

export default Home
