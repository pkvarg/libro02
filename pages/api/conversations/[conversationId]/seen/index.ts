import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'

import prisma from '@/libs/prismadb'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req, res)
    const { conversationId } = req.query

    if (!currentUser?.id || !currentUser?.email) {
      throw new Error('Neplatné ID')
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId.toString(),
      },
      include: {
        messages: {
          select: { id: true, seenIds: true },
        },
      },
    })

    if (!conversation || !conversation.userIds.includes(currentUser.id)) {
      throw new Error('Neplatné ID')
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1]

    // Nothing to mark; the response carries no conversation data.
    if (!lastMessage || lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return res.json('Success')
    }

    await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    return res.json('Success')
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN')
    return res.json('Error')
  }
}
