import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return

  // Only the author or an admin may delete a post.
  const mayEdit = async (postId: string) => {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    return !!post && (post.userId === currentUser.id || !!currentUser.isAdmin)
  }

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
      if (!(await mayEdit(postId))) {
        return res.status(403).end()
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
      // Hiding or restoring a post is a moderation action for admins.
      if (!currentUser.isAdmin) {
        return res.status(403).end()
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
