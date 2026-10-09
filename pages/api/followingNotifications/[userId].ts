import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  try {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID')
    }
    if (userId !== currentUser.id) {
      return res.status(403).end()
    }
    const notifications = await prisma.followingNotification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hasNotification: false,
      },
    })

    return res.status(200).json(notifications)
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
