import { NextApiRequest, NextApiResponse } from 'next'

import serverAuth from '@/libs/serverAuth'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { publicBookSelect, publicUserSelect, visibleContent } from '@/libs/userFields'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end()
  }
  if (req.method === 'POST') {
    try {
      const { currentUser } = await serverAuth(req, res)

      const {
        bookImage,
        bookTitle,
        bookAuthor,
        bookLendingDuration,
        bookReview,
      } = req.body

      await prisma.book.create({
        data: {
          userId: currentUser.id,
          bookImage,
          bookTitle,
          bookAuthor,
          bookLendingDuration,
          bookReview,
          active: true,
        },
      })

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  } else if (req.method === 'GET') {
    // Logged-out visitors get a teaser of the catalogue: no owners, no reviews, no member data.
    const auth = await serverAuth(req, res)
    if (!auth?.currentUser && !req.query.userId) {
      try {
        const books = await prisma.book.findMany({
          where: visibleContent(false),
          select: publicBookSelect,
          orderBy: {
            createdAt: 'desc',
          },
        })
        return res.status(200).json(books)
      } catch (error) {
        console.log(error)
        return res.status(400).end()
      }
    }
    const currentUser = await requireUser(req, res)
    if (!currentUser) return
    try {
      const { userId } = req.query
      let books

      if (userId && typeof userId === 'string') {
        books = await prisma.book.findMany({
          where: {
            userId,
            ...visibleContent(currentUser.isAdmin),
          },
          // include: {
          //   user: true,
          //   comments: true,
          // },
          orderBy: {
            createdAt: 'desc',
          },
        })
      } else {
        books = await prisma.book.findMany({
          where: visibleContent(currentUser.isAdmin),
          include: {
            user: { select: publicUserSelect },
          },
          // where: {
          //   userId,
          // },
          // include: {
          //   user: true,
          //   comments: true,
          // },
          orderBy: {
            createdAt: 'desc',
          },
        })
      }

      return res.status(200).json(books)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
