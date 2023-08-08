import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'

//import { pusherServer } from '@/app/libs/pusher'
import prisma from '@/libs/prismadb'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
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

    // await pusherServer.trigger(conversationId, 'messages:new', newMessage)

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1]

    // updatedConversation.users.map((user) => {
    //   pusherServer.trigger(user.email!, 'conversation:update', {
    //     id: conversationId,
    //     messages: [lastMessage],
    //   })
    // })

    return res.json(newMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return res.status(500).json('Error')
  }
}
