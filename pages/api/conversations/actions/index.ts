import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

import { requireUser } from '@/libs/requireUser'
import { chatUserSelect } from '@/libs/userFields'

export default async function GetAction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: { select: chatUserSelect },
        messages: {
          include: {
            sender: { select: chatUserSelect },
            seen: { select: chatUserSelect },
          },
        },
      },
    })

    // The chat UI does not use a member list here; it used to be a full dump of all accounts.
    return res.status(200).json({ conversations, users: [] })
  } catch (error: any) {
    console.log(error)
    return res.status(400).end()
  }
}
