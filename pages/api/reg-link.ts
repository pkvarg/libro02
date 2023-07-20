import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import EmailViaNodemailer from '@/libs/emailViaNodemailer'
import EmailViaResend from '@/libs/emailViaResend/emailViaResend'
import createRegisterToken from '@/libs/createRegisterToken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { email, username, name, password, type, url } = req.body

    console.log('reg-link:', req.body)

    const { registerToken, token, registerURL } = await createRegisterToken(
      email,
      url
    )

    console.log(registerToken, token, registerURL)

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
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
