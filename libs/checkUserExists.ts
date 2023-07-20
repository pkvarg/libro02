import crypto from 'crypto'
import prisma from '@/libs/prismadb'

export default async function checkUserExists(email: string) {
  let existingUser

  try {
    existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  } catch (error) {
    console.log(error)
  }

  return existingUser
}
