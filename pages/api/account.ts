import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { callHono } from '@/libs/honoApi'

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

  const requestedAt = new Date()
  try {
    await prisma.post.updateMany({ where: { userId: currentUser.id }, data: { active: false } })
    await prisma.book.updateMany({ where: { userId: currentUser.id }, data: { active: false } })
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { active: false, deletionRequestedAt: requestedAt },
    })

    // Tell the admin by e-mail; the request itself is already saved, so a mail failure
    // must not fail it (the admin panel shows pending requests too).
    const deadline = new Date(requestedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    try {
      await callHono('deletion-request', {
        name: currentUser.name,
        username: currentUser.username,
        requestedAt: requestedAt.toLocaleDateString('sk-SK', { timeZone: 'Europe/Bratislava' }),
        deadline: deadline.toLocaleDateString('sk-SK', { timeZone: 'Europe/Bratislava' }),
        origin: 'LIBROSOPHIA',
      })
    } catch (error) {
      console.log('deletion-request e-mail failed', error)
    }
    return res.status(200).json('OK')
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
