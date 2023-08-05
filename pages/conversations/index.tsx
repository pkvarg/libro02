'use client'

// import getConversations from '@/actions/getConversations'
// import getUsers from '@/actions/getUsers'
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

// async function ConversationsLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const conversations = await getConversations()
//   const users = await getUsers()

//   return (
//     <>
//       <div className='h-full bg-[#ffffff]'>
//         <ConversationList
//           users={users}
//           title='Messages'
//           initialItems={conversations}
//         />
//         {children}
//       </div>
//     </>
//   )
// }

export default Home
