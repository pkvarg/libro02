import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import createRegisterToken from '@/libs/createRegisterToken'
import { prismaAuth as prisma } from '@/libs/prismadb'
import axios from 'axios'
import siteUrl from '@/libs/siteUrl'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { email, username, name, password, url, consent } = req.body

    // Registration requires explicit consent (see /privacy); the time is kept as proof.
    if (consent !== true) {
      return res.status(400).json('Chýba súhlas so spracúvaním osobných údajov')
    }

    const { registerToken, registerTokenExpires, token, registerURL } = await createRegisterToken(
      email,
      siteUrl(url),
    )

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        username,
        name,
        hashedPassword,
        isRegistered: false,
        registerToken,
        registerTokenExpires,
        consentAt: new Date(),
      },
    })

    // hono
    const apiUrl = 'https://hono-api.pictusweb.com/api/librosophia/register'
    //const apiUrl = 'http://localhost:3013/api/librosophia/register'

    const origin = 'LIBROSOPHIA'

    try {
      const apiResponse = await axios.put(
        apiUrl,
        { name, email, username, registerUrl: registerURL, origin },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('res', apiResponse)

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
