import crypto from 'crypto'
import prisma from '@/libs/prismadb'

export default async function createResetToken(existingUser: any, url: String) {
  const resetToken = crypto.randomBytes(32).toString('hex')
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  const date = new Date()
  const expiryDate = new Date(date.getTime() + 15 * 60000)
  const passwordResetExpires = expiryDate.toISOString().replace('Z', '+00:00')
  const email = existingUser.email
  const resetURL: string = `${url}/resetPassword/${resetToken}/${email}`

  const data = {
    email,
    passwordResetToken,
    passwordResetExpires,
    resetToken,
    resetURL,
  }

  try {
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        passwordResetExpires,
        passwordResetToken,
      },
    })
  } catch (error) {
    console.log(error)
  }

  return data
}
