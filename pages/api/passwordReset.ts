import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import bcrypt from 'bcrypt'

export default async function passwordReset(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { email, password } = req.body

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  const hashedPassword = await bcrypt.hash(password, 12)

  if (existingUser) {
    try {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          hashedPassword,
        },
      })
      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
