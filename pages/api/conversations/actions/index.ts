import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

import serverAuth from '@/libs/serverAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async function GetAction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { currentUser } = await serverAuth(req, res)
  const session = await getServerSession(req, res, authOptions)
  let conversations
  let users

  console.log('act:')

  if (!currentUser?.id) {
    return []
  }

  if (!session?.user?.email) {
    return []
  }

  try {
    conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    })
    users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session?.user?.email,
        },
      },
    })

    return res.status(200).json({ conversations, users })
  } catch (error: any) {
    console.log(error)
    return res.status(400).end()
  }
}
