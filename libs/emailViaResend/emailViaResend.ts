import { Resend } from 'resend'
import emailTemplate from '@/libs/emailViaResend/emailTemplate'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'

const resend = new Resend(process.env.RESEND_API_KEY)
export default async function EmailViaResend(
  url: String | undefined,
  email: string,
  name: string
) {
  console.log('url', url)
  if (url === undefined) {
    try {
      await resend.sendEmail({
        from: 'email@project.pictusweb.com',
        to: email,
        subject: 'Vitaj',
        react: emailTemplate(name),
      })
      await resend.sendEmail({
        from: 'email@project.pictusweb.com',
        to: 'info@pictusweb.sk',
        subject: 'Nová registrácia',
        react: emailTemplate(name),
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    if (existingUser) {
      const { resetURL } = await createResetToken(existingUser, url)

      try {
        await resend.sendEmail({
          from: 'email@project.pictusweb.com',
          to: email,
          subject: 'Link pre obnovu hesla',
          react: emailTemplate(resetURL),
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}