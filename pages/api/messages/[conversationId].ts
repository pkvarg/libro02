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
        // sender: {
        //   select: {
        //     // Specify the keys you want to include in the 'sender' object
        //     id: true,
        //     name: true,
        //     email: true,
        //     profileImage: true,
        //   },
        // },
        seen: true,
        // seen: {
        //   select: {
        //     // Specify the keys you want to include in the 'sender' object
        //     id: true,

        //     // Exclude other keys you don't want
        //     // excludedKey1: false,
        //     // excludedKey2: false,
        //   },
        // },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    //console.log('msgs', messages)

    return res.status(200).json(messages)
  } catch (error: any) {
    console.log(error)
    return res.status(400).end()
  }
}
