import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import crypto from 'crypto'

export default async function checkRegistrationToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { token, email } = req.body

  let existingUser

  if (email) {
    existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  }

  let checkTokens: boolean
  let expiry: boolean

  if (existingUser) {
    const hashedDBToken = existingUser?.registerToken
    const hashActualToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    console.log('chRT:', token, hashActualToken, hashedDBToken)
    const tokenExpiry = existingUser?.registerTokenExpires?.toISOString()

    checkTokens = hashedDBToken === hashActualToken
    const date = new Date()
    const dateISO = date.toISOString()

    if (tokenExpiry !== undefined && tokenExpiry > dateISO) {
      expiry = true
    } else {
      expiry = false
    }

    if (expiry && checkTokens) {
      const setExistingUserToRegistered = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          isRegistered: true,
        },
      })

      return res.status(200).json(checkTokens)
    } else {
      return res.status(400).end()
    }
  }
}
