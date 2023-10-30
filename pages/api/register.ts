import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import EmailViaNodemailer from '@/libs/emailViaNodemailer'
import EmailViaResend from '@/libs/emailViaResend/emailViaResend'
import createRegisterToken from '@/libs/createRegisterToken'
import checkUserExists from '@/libs/checkUserExists'
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

    const { registerToken, registerTokenExpires, token, registerURL } =
      await createRegisterToken(email, url)

    const hashedPassword = await bcrypt.hash(password, 12)

    const existingUser = await checkUserExists(email)
    if (existingUser && existingUser.isRegistered) {
      return res.status(200).json(existingUser)
    } else if (existingUser && existingUser.isRegistered === false) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          username,
          name,
          hashedPassword,
          registerToken,
          registerTokenExpires,
        },
      })
      await EmailViaResend(registerURL, email, name, 'reg-link-resend')
      return res.status(200).json('OK')
    } else {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          name,
          hashedPassword,
          isRegistered: false,
          registerToken,
          registerTokenExpires,
        },
      })

      /* nodemailer not implemented */
      if (type === 'reg-link-nodemailer') {
        await new EmailViaNodemailer(
          email,
          username,
          name,
          type,
          registerURL
        ).send()
      } else if (type === 'reg-link-resend') {
        await EmailViaResend(registerURL, email, name, type)
      }
      return res.status(200).json('OK')
    }
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
