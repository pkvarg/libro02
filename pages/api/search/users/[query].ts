import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { publicUserSelect } from '@/libs/userFields'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  const { query } = req.query
  if (query) {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Neplatný search')
      }
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            // Searching by e-mail would reveal addresses, so only admins can.
            ...(currentUser.isAdmin ? [{ email: { contains: query, mode: 'insensitive' as const } }] : []),
            { username: { contains: query, mode: 'insensitive' } },
          ],
        },
        ...(currentUser.isAdmin ? {} : { select: publicUserSelect }),
      })
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
