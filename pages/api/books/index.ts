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

  try {
    // if (req.method === 'POST') {
    //   const { currentUser } = await serverAuth(req, res)
    //   const { body } = req.body

    //   const post = await prisma.post.create({
    //     data: {
    //       body,
    //       userId: currentUser.id,
    //     },
    //   })

    //   return res.status(200).json(post)
    // }

    if (req.method === 'GET') {
      const { userId } = req.query

      console.log({ userId })

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
    }
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
