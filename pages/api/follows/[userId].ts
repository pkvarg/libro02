import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

// Only what a profile card shows; never e-mails or other account fields.
const publicProfile = {
  id: true,
  name: true,
  username: true,
  bio: true,
  profileImage: true,
} as const

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const currentUser = await requireUser(req, res)
  if (!currentUser) return

  const { userId, type } = req.query
  if (!userId || typeof userId !== 'string' || !/^[a-f0-9]{24}$/i.test(userId)) {
    return res.status(400).json('Neplatné ID')
  }
  if (type !== 'followers' && type !== 'following') {
    return res.status(400).json('Neplatný typ zoznamu')
  }

  // Same visibility as the member list: registered accounts; pending deletions only for admins.
  const visible = {
    isRegistered: true,
    ...(currentUser.isAdmin
      ? {}
      : { OR: [{ deletionRequestedAt: null }, { deletionRequestedAt: { isSet: false } }] }),
  }

  try {
    if (type === 'following') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { followingIds: true },
      })
      if (!user) {
        return res.status(404).end()
      }
      const users = await prisma.user.findMany({
        where: { id: { in: user.followingIds.filter((id) => id !== userId) }, ...visible },
        select: publicProfile,
        orderBy: { name: 'asc' },
      })
      return res.status(200).json(users)
    }

    const users = await prisma.user.findMany({
      // Older follow data can contain self-follows; a profile never lists itself.
      where: { followingIds: { has: userId }, id: { not: userId }, ...visible },
      select: publicProfile,
      orderBy: { name: 'asc' },
    })
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
