import { requireUser } from '@/libs/requireUser'
import { chatUserSelect } from '@/libs/userFields'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  try {
    const { userId, isGroup, members, name } = req.body

    if (!isGroup && (typeof userId !== 'string' || !/^[a-f0-9]{24}$/i.test(userId) || userId === currentUser.id)) {
      return res.status(400).json('Neplatné ID')
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      throw new Error('Invalid data')
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: { select: chatUserSelect },
        },
      })

      return res.json(newConversation)
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    })

    const singleConversation = existingConversations[0]

    if (singleConversation) {
      return res.json(singleConversation)
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      // include: {
      //   users: true,
      // },
      include: {
        users: { select: chatUserSelect },
      },
    })

    return res.json(newConversation)
  } catch (error: any) {
    console.log(error)
    return res.status(400).end()
  }
}
