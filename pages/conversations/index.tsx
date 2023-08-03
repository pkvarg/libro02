'use client'

// import getConversations from '@/actions/getConversations'
// import getUsers from '@/actions/getUsers'
import ConversationList from './components/ConversationList'

import clsx from 'clsx'
import useConversation from '@/hooks/useConversation'
import EmptyState from '@/pages/conversations/components/EmptyState'

const Home = () => {
  const { isOpen } = useConversation()

  return (
    <div
      className={clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')}
    >
      <ConversationList initialItems={[]} users={[]} />
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
