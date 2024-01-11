import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'
import EmailViaNodemailer from '@/libs/emailViaNodemailer'
import EmailViaResend from '@/libs/emailViaResend/emailViaResend'
import axios from 'axios'

export default async function forgotPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email, url, name, username, type } = req.body

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (existingUser) {
    const { resetURL, resetToken } = await createResetToken(existingUser, url)
    try {
      if (type === 'reset-password-nodemailer') {
        await axios.put(
          'https://tss.pictusweb.com/email/libro/mailer',
          //'http://localhost:3010/email/libro/mailer',
          {
            email,
            username,
            name,
            type,
            url: resetURL,
          }
        )
      } else if (type === 'reset-password-resend') {
        console.log(type)
        await EmailViaResend(url, email, name, type)
      }

      return res.status(200).json(resetToken)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
