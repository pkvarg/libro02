import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import createRegisterToken from '@/libs/createRegisterToken'
import prisma from '@/libs/prismadb'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { email, username, name, password, url } = req.body

    const { registerToken, registerTokenExpires, token, registerURL } = await createRegisterToken(
      email,
      url,
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
      },
    })

    // hono
    //const apiUrl = 'https://hono-api.pictusweb.com/api/librosophia/register'
    const apiUrl = 'http://localhost:3013/api/librosophia/register'

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
