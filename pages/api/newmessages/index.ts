import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'
import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { currentUser } = await serverAuth(req, res)
      const body = req.body
      const { formData, image, conversationId } = body
      const message = formData

      if (!currentUser?.id || !currentUser?.email) {
        return res.status(401).json('Unauthorised')
      }

      const newMessage = await prisma.message.create({
        include: {
          sender: {
            select: {
              // Specify the keys you want to include in the 'sender' object
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
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
          // users: true,
          users: {
            select: {
              // Specify the keys you want to include in the 'sender' object
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            include: {
              seen: true,
            },
          },
        },
      })

      const lastMessage =
        updatedConversation.messages[updatedConversation.messages.length - 1]

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
