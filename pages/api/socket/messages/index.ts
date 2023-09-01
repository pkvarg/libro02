import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import serverAuth from '@/libs/serverAuth'
import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === 'POST') {
    try {
      const { currentUser } = await serverAuth(req, res)
      const body = req.body
      const { message, image, conversationId } = body

      if (!currentUser?.id || !currentUser?.email) {
        return res.status(401).json('Unauthorised')
      }

      const newMessage = await prisma.message.create({
        include: {
          seen: true,
          sender: true,
        },
        data: {
          body: message,
          image: image,
          conversation: {
            connect: { id: conversationId },
          },
          sender: {
            connect: { id: currentUser.id },
          },

          seen: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      })

      const updatedConversation = await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
        include: {
          users: true,

          messages: {
            include: {
              seen: true,
            },
          },
        },
      })

      return res.json(newMessage)
    } catch (error) {
      console.log(error, 'ERROR_MESSAGES')
      return res.status(500).json('Error')
    }
  } else if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany()
      return res.json(messages)
    } catch (error) {
      return res.status(500).json('Error')
    }
  }
}
