import { NextApiRequest, NextApiResponse } from 'next'

import serverAuth from '@/libs/serverAuth'
import { pusherServer } from '@/libs/pusher'
import prisma from '@/libs/prismadb'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req, res)
    const { conversationId } = req.query

    if (!currentUser?.id || !currentUser?.email) {
      return res.status(401).json('Unauthorized')
    }

    if (!conversationId || typeof conversationId !== 'string') {
      throw new Error('Neplatné ID')
    }

    // Find existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          // include: {
          //   seen: true,
          // },
        },
        //users: true,
      },
    })

    if (!conversation) {
      return res.status(400).json('Invalid ID')
    }

    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1]

    if (!lastMessage) {
      return res.json(conversation)
    }

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      // include: {
      //   sender: true,
      //   seen: true,
      // },

      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    //Update all connections with new seen
    // await pusherServer.trigger(currentUser.email, 'conversation:update', {
    //   id: conversationId,
    //   messages: [updatedMessage],
    // })

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return res.json(conversation)
    }

    //Update last message seen
    // await pusherServer.trigger(
    //   conversationId!,
    //   'message:update',
    //   updatedMessage
    // )

    return res.json('Success')
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN')
    return res.status(500).json('Error')
  }
}
