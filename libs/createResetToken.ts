import crypto from 'crypto'
import prisma from '@/libs/prismadb'

export default function createResetToken(existingUser: Object, url: String) {
  const resetToken = crypto.randomBytes(32).toString('hex')

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  const date = new Date()
  const expiryDate = new Date(date.getTime() + 15 * 60000)
  const passwordResetExpires = expiryDate.toISOString().replace('Z', '+00:00')
  const resetURL: string = `${url}/resetPassword/${resetToken}`

  const data = {
    passwordResetToken,
    passwordResetExpires,
    resetToken,
    resetURL,
  }

  return data
}
