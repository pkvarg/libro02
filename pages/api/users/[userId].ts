import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireAdmin, requireUser } from '@/libs/requireUser'
import purgeUser from '@/libs/purgeUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const currentUser = await requireUser(req, res)
    if (!currentUser) return
    try {
      const { userId } = req.query
      if (!userId || typeof userId !== 'string') {
        return
        //throw new Error('Neplatné ID')
      }
      let existingUser
      existingUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      const followersCount = await prisma.user.count({
        where: {
          followingIds: {
            has: userId,
          },
        },
      })

      return res.status(200).json({ ...existingUser, followersCount })
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  } else if (req.method === 'DELETE') {
    // Permanent deletion is the admin's step after a member asked to delete their account.
    const admin = await requireAdmin(req, res)
    if (!admin) return
    const { userId } = req.query
    if (!userId || typeof userId !== 'string' || userId === admin.id) {
      return res.status(400).end()
    }
    try {
      await purgeUser(userId)
      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(500).end()
    }
  } else if (req.method === 'PATCH') {
    const admin = await requireAdmin(req, res)
    if (!admin) return
    try {
      const { privilege, status } = req.body
      const { userId } = req.query
      if (!userId || typeof userId !== 'string') {
        throw new Error('Neplatné ID')
      }

      if (privilege === 'isAdmin') {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            isAdmin: status,
          },
        })
        return res.status(200).json('OK')
      } else if (privilege === 'active') {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            active: status,
          },
        })
        return res.status(200).json('OK')
      }
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
