import { Resend } from 'resend'
import TemplateEmail from '@/libs/emails/TemplateEmail'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'

const resend = new Resend(process.env.RESEND_API_KEY)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { email, name, username, url } = req.body

  if (url === undefined) {
    try {
      await resend.sendEmail({
        from: 'email@project.pictusweb.com',
        to: email,
        subject: 'Vitaj',
        react: TemplateEmail(name),
      })
      return res.status(200).json({
        status: 'OK',
      })
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  } else {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    if (existingUser) {
      const { resetURL, resetToken } = await createResetToken(existingUser, url)

      try {
        await resend.sendEmail({
          from: 'email@project.pictusweb.com',
          to: email,
          subject: 'Link pre obnovu hesla',
          react: TemplateEmail(resetURL),
        })
        return res.status(200).json(resetToken)
      } catch (error) {
        console.log(error)
        return res.status(400).end()
      }
    }
  }
}
