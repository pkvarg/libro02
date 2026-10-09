import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { chatUserSelect } from '@/libs/userFields'

export default async function GetMessages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  try {
    const { conversationId } = req.query

    if (!conversationId || typeof conversationId !== 'string') {
      throw new Error('Neplatné ID')
    }
    // Only members of the conversation may read it.
    const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conversation || !conversation.userIds.includes(currentUser.id)) {
      return res.status(403).end()
    }
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: { select: chatUserSelect },

        seen: { select: chatUserSelect },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return res.status(200).json(messages)
  } catch (error: any) {
    console.log(error)
    return res.status(400).end()
  }
}
