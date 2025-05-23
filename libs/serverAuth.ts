import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prismadb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    console.log('Užívateľ neprihlásený 1')
    return
    //throw new Error('Užívateľ neprihlásený 1')
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  console.log('current user is:', currentUser?.name)

  if (!currentUser) {
    console.log('Užívateľ neprihlásený 2')
    return
    //throw new Error('Užívateľ neprihlásený 2')
  }

  return { currentUser }
}

export default serverAuth
