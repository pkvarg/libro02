import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { publicUserSelect, visibleContent } from '@/libs/userFields'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  const { query } = req.query
  if (query) {
    try {
      if (!query || typeof query !== 'string') {
        return
        //throw new Error('Neplatný search')
      }
      const tweets = await prisma.post.findMany({
        where: {
          ...visibleContent(currentUser.isAdmin),
          OR: [
            { body: { contains: query, mode: 'insensitive' } },
            {
              user: {
                name: { contains: query as string, mode: 'insensitive' },
              },
            },
          ],
        },
        include: {
          user: { select: publicUserSelect },
        },
      })
      res.status(200).json(tweets)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
