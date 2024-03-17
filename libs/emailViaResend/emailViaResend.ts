import { Resend } from 'resend'
import emailTemplate from '@/libs/emailViaResend/emailTemplate'
import emailRegister from './emailRegister'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'

const resend = new Resend(process.env.RESEND_API_KEY)
export default async function EmailViaResend(
  url: string | undefined,
  email: string,
  name: string,
  type: string
) {
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
  } else if (url !== undefined && type === 'reg-link-resend') {
    try {
      await resend.sendEmail({
        from: 'email@project.pictusweb.com',
        to: email,
        subject: 'Registračný Link',
        react: emailRegister(url),
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
