import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query
  if (query) {
    try {
      console.log(query)
      if (!query || typeof query !== 'string') {
        throw new Error('Neplatný search')
      }
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ],
        },
      })
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
