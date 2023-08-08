import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import serverAuth from '@/libs/serverAuth'

export default async function GetConversationById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { currentUser } = await serverAuth(req, res)
    const { conversationId } = req.query

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
