import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import serverAuth from '@/libs/serverAuth'
import { pusherServer } from '@/libs/pusher'

export default async function GetConversationById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { currentUser } = await serverAuth(req, res)
  const { conversationId } = req.query

  if (req.method === 'DELETE') {
    try {
      if (!currentUser?.id) {
        return res.json(null)
      }

      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const existingConversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          users: true,
        },
      })

      if (!existingConversation) {
        return res.status(400).json('Invalid ID')
      }

      const deletedConversation = await prisma.conversation.deleteMany({
        where: {
          id: conversationId,
          userIds: {
            hasSome: [currentUser.id],
          },
        },
      })

      existingConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            'conversation:remove',
            existingConversation
          )
        }
      })

      return res.json(deletedConversation)
    } catch (error) {
      return res.json(null)
    }
  } else
    try {
      if (!currentUser?.email) {
        return null
      }

      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          users: true,
        },
      })

      return res.status(200).json(conversation)
    } catch (error: any) {
      console.log(error, 'SERVER_ERROR')
      return res.status(400).end()
    }
}
