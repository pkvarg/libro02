import serverAuth from '@/libs/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { pusherServer } from '@/libs/pusher'
import prisma from '@/libs/prismadb'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req, res)
    const { userId, isGroup, members, name } = req.body

    if (!currentUser?.id || !currentUser?.email) {
      throw new Error('Unauthorized')
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
          users: true,
        },
      })

      //Update all connections with new conversation
      newConversation.users.forEach((user) => {
        console.log('server1', user)
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation)
        }
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
        users: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            email: true, // Include the 'email' field
          },
        },
      },
    })

    //Update all connections with new conversation
    newConversation.users.map((user) => {
      console.log('server2', user.email)
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation)
      }
    })

    return res.json(newConversation)
  } catch (error: any) {
    throw new Error('Internal error')
  }
}
