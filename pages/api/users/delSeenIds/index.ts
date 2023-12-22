import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { userAgent } from 'next/server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body
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
