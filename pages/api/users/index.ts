import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { requireUser } from '@/libs/requireUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const currentUser = await requireUser(req, res)
  if (!currentUser) return
  try {
    const users = await prisma.user.findMany({
      where: {
        isRegistered: true,
        // Accounts waiting for deletion are visible only to admins.
        ...(currentUser.isAdmin
          ? {}
          : { OR: [{ deletionRequestedAt: null }, { deletionRequestedAt: { isSet: false } }] }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
