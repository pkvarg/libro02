import { Resend } from 'resend'
import WelcomeEmail from '@/pages/emails/welcome'
import { NextApiRequest, NextApiResponse } from 'next'

const resend = new Resend(process.env.RESEND_API_KEY)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { email, name, username } = req.body
  console.log(email, name, username)
  try {
    await resend.sendEmail({
      from: 'email@project.pictusweb.com',
      to: email,
      subject: 'Vitaj',
      react: WelcomeEmail(name),
    })
    return res.status(200).json({
      status: 'OK',
    })
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
