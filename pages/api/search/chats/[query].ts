import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query
  if (query) {
    try {
      console.log(query)
      if (!query || typeof query !== 'string') {
        return
        //throw new Error('Neplatný search')
      }
      const chats = await prisma.message.findMany({
        where: {
          OR: [
            { body: { contains: query, mode: 'insensitive' } },
            {
              sender: {
                name: { contains: query as string, mode: 'insensitive' },
              },
            },
          ],
        },
        include: {
          sender: true,
        },
      })
      res.status(200).json(chats)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
