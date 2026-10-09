import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

export default async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  try {
    const { messageId } = req.query

    if (!messageId || typeof messageId !== 'string') {
      throw new Error('Neplatné ID')
    }
    // Only the sender or an admin may delete a message.
    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message || (message.senderId !== currentUser.id && !currentUser.isAdmin)) {
      return res.status(403).end()
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
