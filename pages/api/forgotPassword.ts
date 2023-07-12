import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'
import Email from '@/libs/email'

export default async function forgotPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email, url } = req.body

  console.log('API-fP:', email, url)

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (existingUser) {
    const { resetURL, resetToken, passwordResetExpires, passwordResetToken } =
      createResetToken(existingUser, url)
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          passwordResetExpires,
          passwordResetToken,
        },
      })
      await new Email(email, resetURL).send()

      return res.status(200).json(resetToken)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
