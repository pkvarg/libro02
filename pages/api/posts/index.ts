import { NextApiRequest, NextApiResponse } from 'next'

import serverAuth from '@/libs/serverAuth'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'
import { publicUserSelect, visibleContent } from '@/libs/userFields'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res)
      const { body } = req.body

      const post = await prisma.post.create({
        data: {
          body,
          userId: currentUser.id,
          active: true,
        },
      })

      return res.status(200).json(post)
    }

    if (req.method === 'GET') {
      const currentUser = await requireUser(req, res)
      if (!currentUser) return
      const { userId } = req.query

      let posts

      if (userId && typeof userId === 'string') {
        posts = await prisma.post.findMany({
          where: {
            userId,
            ...visibleContent(currentUser.isAdmin),
          },
          include: {
            user: { select: publicUserSelect },
            comments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      } else {
        posts = await prisma.post.findMany({
          where: visibleContent(currentUser.isAdmin),
          include: {
            user: { select: publicUserSelect },
            comments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      }

      return res.status(200).json(posts)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
