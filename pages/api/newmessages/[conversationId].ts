import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function GetMessages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { conversationId } = req.query

    if (!conversationId || typeof conversationId !== 'string') {
      throw new Error('Neplatné ID')
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,

        seen: true,
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
