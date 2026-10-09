import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return

  // Only the owner or an admin may change or delete a book.
  const mayEdit = async (bookId: string) => {
    const book = await prisma.book.findUnique({ where: { id: bookId } })
    return !!book && (book.userId === currentUser.id || !!currentUser.isAdmin)
  }

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

      // A hidden book stays visible only to its owner and admins.
      if (
        !book ||
        (!Array.isArray(book) && book.active === false && book.userId !== currentUser.id && !currentUser.isAdmin)
      ) {
        return res.status(404).end()
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
      if (!(await mayEdit(bookId))) {
        return res.status(403).end()
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
      if (!(await mayEdit(bookId))) {
        return res.status(403).end()
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
          // Hiding or restoring a book is a moderation action for admins.
          ...(currentUser.isAdmin ? { active: status } : {}),
        },
      })

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
