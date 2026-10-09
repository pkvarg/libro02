import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { visibleContent } from '@/libs/userFields'

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
      const books = await prisma.book.findMany({
        where: {
          ...visibleContent(currentUser.isAdmin),
          OR: [
            { bookTitle: { contains: query, mode: 'insensitive' } },
            { bookAuthor: { contains: query, mode: 'insensitive' } },
            // { bookReview: { contains: query, mode: 'insensitive' } },
          ],
        },
      })
      res.status(200).json(books)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
