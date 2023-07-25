import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import serverAuth from '@/libs/serverAuth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { currentUser } = await serverAuth(req, res)

    const {
      bookImage,
      bookTitle,
      bookAuthor,
      bookLendingDuration,
      bookReview,
    } = req.body

    const myBook = await prisma.book.create({
      data: {
        userId: currentUser.id,
        bookImage,
        bookTitle,
        bookAuthor,
        bookLendingDuration,
        bookReview,
      },
    })

    return res.status(200).json('OK')
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
