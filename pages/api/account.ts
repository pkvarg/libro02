import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

/**
 * A member's request to delete their account. The account is blocked and its posts
 * and books hidden at once; the admin then deletes it permanently (within 30 days,
 * as promised in /privacy) via /api/users/[userId] DELETE.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).end()
  }
  const currentUser = await requireUser(req, res)
  if (!currentUser) return

  try {
    await prisma.post.updateMany({ where: { userId: currentUser.id }, data: { active: false } })
    await prisma.book.updateMany({ where: { userId: currentUser.id }, data: { active: false } })
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { active: false, deletionRequestedAt: new Date() },
    })
    return res.status(200).json('OK')
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
