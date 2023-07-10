import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Email from '@/libs/email'

export default async function forgotPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const email = req.body.email
  const origURL = req.body.url
  console.log('fP:', req.body)
  //let existingUser

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
    }

    const secret = process.env.JWT_SECRET || ''
    const token = sign({ existingUser }, secret, { expiresIn: 20 })
    const hashedToken = await bcrypt.hash(token, 12)
    const resetURL = `${origURL}/resetPassword/${hashedToken}`
    console.log('eUser:', email, 'resetURL:', resetURL)
    await new Email(email, resetURL).send()

    return res.status(200).json(token)
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
