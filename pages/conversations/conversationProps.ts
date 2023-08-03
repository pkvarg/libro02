import getConversations from '@/actions/getConversations'
import getUsers from '@/actions/getUsers'

export default async function ConversationsListProps() {
  const conversations = await getConversations()
  const users = await getUsers()

  return { conversations, users }
}
