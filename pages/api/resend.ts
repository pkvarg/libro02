import { Resend } from 'resend'
import TemplateEmail from '@/libs/emails/TemplateEmail'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { email, name, username, url } = req.body
  console.log(email, name, username, url)
  try {
    if (url === undefined) {
      await resend.sendEmail({
        from: 'email@project.pictusweb.com',
        to: email,
        subject: 'Vitaj',
        react: TemplateEmail(name),
      })
      return res.status(200).json({
        status: 'OK',
      })
    } else {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      })

      const resetToken = crypto.randomBytes(32).toString('hex')
      if (existingUser) {
        const passwordResetToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex')
        console.log('prt:', { passwordResetToken })

        const data = {
          passwordResetToken,
        }

        const updatedUser = await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data,
        })
      }

      console.log('rt:', { resetToken })

      const resetURL = `${url}/resetPassword/${resetToken}`
      console.log('resetURL:', resetURL)
      await resend.sendEmail({
        from: 'email@project.pictusweb.com',
        to: email,
        subject: 'Link pre obnovu hesla',
        react: TemplateEmail(resetURL),
      })
      return res.status(200).json(resetToken)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
