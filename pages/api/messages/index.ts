import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'

import { pusherServer } from '@/libs/pusher'
import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { currentUser } = await serverAuth(req, res)
      const body = req.body
      const { message, image, conversationId } = body

      if (!currentUser?.id || !currentUser?.email) {
        return res.status(401).json('Unauthorised')
      }

      const newMessage = await prisma.message.create({
        include: {
          seen: true,
          sender: true,
          // sender: {
          //   select: {
          //     // Specify the keys you want to include in the 'sender' object
          //     id: true,
          //     name: true,
          //     email: true,
          //     profileImage: true,
          //   },
          // },
        },
        data: {
          body: message,
          image: image,
          conversation: {
            connect: { id: conversationId },
          },
          sender: {
            connect: { id: currentUser.id },
          },

          seen: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      })

      const updatedConversation = await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
        include: {
          users: true,
          // users: {
          //   select: {
          //     // Specify the keys you want to include in the 'sender' object
          //     id: true,
          //     name: true,
          //     email: true,
          //   },
          // },
          messages: {
            include: {
              seen: true,
            },
          },
        },
      })

      // const excludedKeys = ['coverImage', 'profileImage']

      // const modifiedNewMessage = newMessage.seen.map((seen) => {
      //   const { coverImage, ...rest } = seen
      //   return rest
      // })

      // const { coverImage, profileImage, ...rest } = seen
      // return rest

      // const modifiedUpdatedConversation = updatedConversation.messages.map(
      //   (message) => ({
      //     ...message,
      //     seen: message.seen.map((seenItem) => {
      //       const { coverImage, profileImage, ...rest } = seenItem
      //       return rest
      //     }),
      //   })
      // )

      //console.log('mdff', modifiedCnv2)

      // console.log('newM', newMessage)

      //await pusherServer.trigger(conversationId, 'messages:new', newMessage)

      // const lastMessage =
      //   updatedConversation.messages[updatedConversation.messages.length - 1]

      // updatedConversation.users.map((user) => {
      //   pusherServer.trigger(user.email!, 'conversation:update', {
      //     id: conversationId,
      //     messages: [lastMessage],
      //   })
      // })

      return res.json(newMessage)
    } catch (error) {
      console.log(error, 'ERROR_MESSAGES')
      return res.status(500).json('Error')
    }
  } else if (req.method === 'GET') {
    console.log('gte?')
    try {
      const messages = await prisma.message.findMany()
      return res.json(messages)
    } catch (error) {
      return res.status(500).json('Error')
    }
  }
}
