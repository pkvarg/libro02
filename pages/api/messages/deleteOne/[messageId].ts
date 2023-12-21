import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { messageId } = req.query

    if (!messageId || typeof messageId !== 'string') {
      throw new Error('Neplatné ID')
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    })

    return res.status(200).json('OK')
  } catch (error: any) {
    console.log(error)
    return res.status(400).end()
  }
}
