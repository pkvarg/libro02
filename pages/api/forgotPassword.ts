import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'
import EmailNodemailer from '@/libs/emailNodemailer'

export default async function forgotPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email, url } = req.body

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (existingUser) {
    const { resetURL, resetToken } = await createResetToken(existingUser, url)
    try {
      await new EmailNodemailer(email, resetURL).send()

      return res.status(200).json(resetToken)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
