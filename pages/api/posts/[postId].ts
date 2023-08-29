import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { postId } = req.query

      if (!postId || typeof postId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          user: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })

      return res.status(200).json(post)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { postId } = req.query

      console.log('PO-DEL', postId)

      if (!postId || typeof postId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
      })

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
  if (req.method === 'PATCH')
    try {
      const { postId } = req.query
      const { status } = req.body

      if (!postId || typeof postId !== 'string') {
        throw new Error('Neplatné ID')
      }
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          active: status,
        },
      })
      return res.status(200).json('OK')
    } catch (error) {
      return res.status(400).end()
    }
}
