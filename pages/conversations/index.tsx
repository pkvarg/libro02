'use client'

import ConversationList from './components/ConversationList'
import AConversationList from './components/AConversationList'

import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/conversations/components/EmptyState'
import { useEffect, useState } from 'react'
import axios from 'axios'
import getUsers from '@/actions/getUsers'

const Home = () => {
  const { isOpen } = useConversation()
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const getActions = async () => {
      const { data } = await axios.get('/api/conversations/actions')
      console.log('ddat:', data)
      if (data) {
        setUsers(data?.users)
        setConversations(data?.conversations)
      }
    }
    getActions()
  }, [])

  return (
    // <div className={clsx('h-full lg:block', isOpen ? 'block' : 'hidden')}>

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
