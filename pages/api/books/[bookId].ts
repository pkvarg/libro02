import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { bookId } = req.query

      if (!bookId || typeof bookId !== 'string') {
        throw new Error('Neplatné ID')
      }

      let book

      if (bookId === undefined) {
        book = await prisma.book.findMany({
          // where: {
          //   id: bookId,
          // },
          // include: {
          //   user: true,
          //   comments: {
          //     include: {
          //       user: true,
          //     },
          //     orderBy: {
          //       createdAt: 'desc',
          //     },
          //   },
          // },
        })
      } else {
        book = await prisma.book.findUnique({
          where: {
            id: bookId,
          },
          // include: {
          //   user: true,
          //   comments: {
          //     include: {
          //       user: true,
          //     },
          //     orderBy: {
          //       createdAt: 'desc',
          //     },
          //   },
          // },
        })
      }

      return res.status(200).json(book)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { bookId } = req.query

      if (!bookId || typeof bookId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const book = await prisma.book.delete({
        where: {
          id: bookId,
        },
      })

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { bookId } = req.query
      const {
        bookImage,
        bookTitle,
        bookAuthor,
        bookLendingDuration,
        bookAvailable,
        bookReview,
        status,
      } = req.body

      if (!bookId || typeof bookId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const book = await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          bookImage,
          bookTitle,
          bookAuthor,
          bookLendingDuration,
          bookAvailable,
          bookReview,
          active: status,
        },
      })

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
