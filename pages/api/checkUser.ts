import { NextApiRequest, NextApiResponse } from 'next'
import checkUserExists from '@/libs/checkUserExists'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email } = req.body

  try {
    const existingUser = await checkUserExists(email)

    // if (existingUser) {
    //   console.log(existingUser)
    // }

    // Only what the login and registration forms need; never the user record itself.
    return res.status(200).json(
      existingUser
        ? { isRegistered: !!existingUser.isRegistered, active: existingUser.active !== false }
        : null
    )
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
