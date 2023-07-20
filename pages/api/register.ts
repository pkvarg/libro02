import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import EmailViaNodemailer from '@/libs/emailViaNodemailer'
import EmailViaResend from '@/libs/emailViaResend/emailViaResend'

import prisma from '@/libs/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { email, username, name, password, type, url } = req.body

    console.log('reg:', req.body)

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        hashedPassword,
      },
    })

    if (type === 'register-nodemailer') {
      await new EmailViaNodemailer(email, username, name, type, url).send()
    } else if (type === 'register-resend') {
      await EmailViaResend(url, email, name, type)
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
