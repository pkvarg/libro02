import { NextApiRequest, NextApiResponse } from 'next'

import { requireUser } from '@/libs/requireUser'
import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }

  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  const { commentId } = req.query

  if (!commentId || typeof commentId !== 'string') {
    return res.status(400).end()
  }

  try {
    // Only the author or an admin may delete a comment.
    const existing = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!existing || (existing.userId !== currentUser.id && !currentUser.isAdmin)) {
      return res.status(403).end()
    }
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
