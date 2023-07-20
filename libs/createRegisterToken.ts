import crypto from 'crypto'
import prisma from '@/libs/prismadb'

export default async function createRegisterToken(email: string, url: String) {
  const token = crypto.randomBytes(32).toString('hex')
  const registerToken = crypto.createHash('sha256').update(token).digest('hex')

  const date = new Date()
  const expiryDate = new Date(date.getTime() + 15 * 60000)
  const registerTokenExpires = expiryDate.toISOString().replace('Z', '+00:00')

  const registerURL: string = `${url}/registerLink/${token}/${email}`

  try {
    const registration = await prisma.registration.create({
      data: {
        email,
        registerToken,
        registerTokenExpires,
      },
    })
  } catch (error) {
    console.log(error)
  }

  const data = {
    email,
    registerToken,
    token,
    registerURL,
  }

  return data
}
