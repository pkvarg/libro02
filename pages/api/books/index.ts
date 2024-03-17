import { NextApiRequest, NextApiResponse } from 'next'

import serverAuth from '@/libs/serverAuth'
import prisma from '@/libs/prismadb'

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
    try {
      const { userId } = req.query
      let books

      if (userId && typeof userId === 'string') {
        books = await prisma.book.findMany({
          where: {
            userId,
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
          include: {
            user: true,
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
  } else {
    let books
    try {
      books = await prisma.book.findMany({
        //include: {
        //user: true,
        //comments: true,

        // },
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
}
