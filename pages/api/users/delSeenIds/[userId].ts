import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { requireAdmin } from '@/libs/requireUser'
import { userAgent } from 'next/server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const admin = await requireAdmin(req, res)
    if (!admin) return
    try {
      const { userId } = req.query

      if (!userId || typeof userId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          seenMessageIds: [],
        },
      })

      return res.status(200).json(updatedUser)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
