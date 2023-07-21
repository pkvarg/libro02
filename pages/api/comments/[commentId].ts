import { NextApiRequest, NextApiResponse } from 'next'

import serverAuth from '@/libs/serverAuth'
import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }

  const { currentUser } = await serverAuth(req, res)
  const { commentId } = req.query

  console.log('cmntid', commentId)

  if (!commentId || typeof commentId !== 'string') {
    throw new Error('Invalid ID')
  }

  try {
    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    })

    return res.status(200).json('OK')
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
