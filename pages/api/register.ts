import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import EmailViaNodemailer from '@/libs/emailViaNodemailer'
import EmailViaResend from '@/libs/emailViaResend/emailViaResend'
import createRegisterToken from '@/libs/createRegisterToken'
import prisma from '@/libs/prismadb'
import axios from 'axios'

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
      const res = await axios.put(
        'https://tss.pictusweb.com/email/libro/mailer',
        // 'http://localhost:3010/email/libro/mailer',
        {
          email,
          username,
          name,
          type,
          url: registerURL,
        }
      )

      console.log('res', res)

      // await new EmailViaNodemailer(
      //   email,
      //   username,
      //   name,
      //   type,
      //   registerURL
      // ).send()
    } else if (type === 'reg-link-resend') {
      await EmailViaResend(registerURL, email, name, type)
    }

    return res.status(200).json('OK')
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
