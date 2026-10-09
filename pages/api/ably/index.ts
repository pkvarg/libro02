import Ably from 'ably/promises'
import { NextApiRequest, NextApiResponse } from 'next'
import { requireUser } from '@/libs/requireUser'

/**
 * Issues a short-lived Ably token for the logged-in member. The secret API key
 * stays on the server; the token only allows the shared presence channel and
 * the member's own conversations.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return

  const key = process.env.ABLY_API_KEY || process.env.NEXT_PUBLIC_ABLY_API_KEY
  if (!key) {
    return res.status(503).json('Chat nie je nakonfigurovaný')
  }

  const capability: Record<string, string[]> = {
    chatroom: ['presence', 'subscribe'],
  }
  for (const conversationId of currentUser.conversationIds) {
    capability[conversationId] = ['publish', 'subscribe']
  }

  try {
    const client = new Ably.Rest({ key })
    const tokenRequest = await client.auth.createTokenRequest({
      // Presence is visible to every member, so it carries the user id, not the e-mail.
      clientId: currentUser.id,
      capability: JSON.stringify(capability),
    })
    return res.status(200).json(tokenRequest)
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
