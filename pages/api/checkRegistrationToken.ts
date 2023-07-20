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

  let existingRegistration

  if (email) {
    existingRegistration = await prisma.registration.findUnique({
      where: {
        email: email,
      },
    })
  }

  let checkTokens: boolean
  let expiry: boolean

  if (existingRegistration) {
    const hashedDBToken = existingRegistration?.registerToken
    const hashActualToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    console.log('chRT:', token, hashActualToken, hashedDBToken)
    const tokenExpiry =
      existingRegistration?.registerTokenExpires?.toISOString()

    checkTokens = hashedDBToken === hashActualToken
    const date = new Date()
    const dateISO = date.toISOString()

    if (tokenExpiry !== undefined && tokenExpiry > dateISO) {
      expiry = true
    } else {
      expiry = false
    }

    if (expiry && checkTokens) {
      return res.status(200).json(checkTokens)
    } else {
      return res.status(400).end()
    }
  }
}
