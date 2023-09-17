'use client'

import ConversationList from './components/ConversationList'
import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/conversations/components/EmptyState'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useSocket from '@/hooks/useSocket'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { socketHttp } from '@/lib/socketHttp'

const Home = () => {
  const { isOpen } = useConversation()
  const session = useSession()
  const router = useRouter()
  const { socketUsers, setSocketUsers, addUsers } = useSocket()

  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [usersOnline, setUsersOnline] = useState([])

  const currentUserEmail = session.data?.user?.email

  const routeIsConversations = router.route.includes('conversations')

  useEffect(() => {
    addUsers(currentUserEmail)
    //socketHttp.emit('addUser', currentUserEmail)
    // setSocketUsers(currentUserEmail)
  }, [socketHttp, currentUserEmail])

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
