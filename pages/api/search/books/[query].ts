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
      const books = await prisma.book.findMany({
        where: {
          OR: [
            { bookTitle: { contains: query, mode: 'insensitive' } },
            { bookAuthor: { contains: query, mode: 'insensitive' } },
            // { bookReview: { contains: query, mode: 'insensitive' } },
          ],
        },
      })
      console.log(books)
      res.status(200).json(books)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
