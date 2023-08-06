'use client'

import ConversationList from './components/ConversationList'

import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/conversations/components/EmptyState'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {
  const { isOpen } = useConversation()
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const getActions = async () => {
      const { data } = await axios.get('/api/conversations/actions')
      console.log('ddat:', data)

      setUsers(data.users)
      setConversations(data.conversations)
    }
    getActions()
  }, [])

  console.log('indexC:', conversations)
  console.log('indexU:', users)

  return (
    <div className={clsx('h-full lg:block', isOpen ? 'block' : 'hidden')}>
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
