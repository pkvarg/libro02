'use client'

import ConversationList from './components/ConversationList'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/conversations/components/EmptyState'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSocket } from '@/components/providers/SocketProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Home = () => {
  const { isOpen } = useConversation()
  const session = useSession()
  const router = useRouter()
  const { socket, socketInstance, usersOnline, addUsers, disconnectUser } =
    useSocket()

  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])

  const currentUserEmail = session.data?.user?.email

  const routeIsConversations = router.route.includes('conversations')

  useEffect(() => {
    addUsers(currentUserEmail)
    return () => {
      disconnectUser(currentUserEmail)
      //socketInstance.disconnect()
    }
    //return () => socketInstance.disconnect()
  }, [currentUserEmail])

  console.log('current', currentUserEmail)

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
