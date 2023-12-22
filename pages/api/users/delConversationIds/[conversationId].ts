import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { forEach } from 'lodash'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { conversationId } = req.query
      const { userId } = req.body

      if (!conversationId || typeof conversationId !== 'string') {
        throw new Error('Neplatné ID')
      }

      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      })

      const usersInConversation = conversation?.userIds

      const otherUserInConversation = conversation?.userIds
        .filter((id) => id !== userId)
        .toString()

      if (conversation === null) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: userId,
            },
          })

          let updatedConversationIds = []

          if (user) {
            // Remove the specific conversationId from the conversationId array
            updatedConversationIds = user.conversationIds.filter(
              (convId) => convId !== conversationId
            )
          }

          // Update the user object in the database with the modified conversationId array
          const updatedUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              conversationIds: updatedConversationIds,
            },
          })
          return res.status(200).json(updatedUser)
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: userId,
            },
          })

          let updatedConversationIds = []

          if (user) {
            // Remove the specific conversationId from the conversationId array
            updatedConversationIds = user.conversationIds.filter(
              (convId) => convId !== conversationId
            )
            // Update the user object in the database with the modified conversationId array
            const updatedUser = await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                conversationIds: updatedConversationIds,
              },
            })
          }

          const otherUser = await prisma.user.findUnique({
            where: {
              id: otherUserInConversation,
            },
          })

          let updatedOtherUserConversationIds = []

          if (otherUser) {
            // Remove the specific conversationId from the conversationId array
            updatedOtherUserConversationIds = otherUser.conversationIds.filter(
              (convId) => convId !== conversationId
            )
            // Update the user object in the database with the modified conversationId array
            const updatedOtherUser = await prisma.user.update({
              where: {
                id: otherUserInConversation,
              },
              data: {
                conversationIds: updatedOtherUserConversationIds,
              },
            })
          }

          const conversation = await prisma.conversation.delete({
            where: {
              id: conversationId,
            },
          })
          return res.status(200).json('Deleted convId from both')
        } catch (error) {
          console.log(error)
          return res.status(400).end()
        }
      }

      console.log('conv', conversation)

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
