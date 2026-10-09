import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/libs/serverAuth'

// Librosophia is a members-only network: every data route needs a logged-in, active user.
export async function requireUser(req: NextApiRequest, res: NextApiResponse) {
  const auth = await serverAuth(req, res)
  const currentUser = auth?.currentUser
  if (!currentUser) {
    res.status(401).json('Neprihlásený užívateľ')
    return null
  }
  if (currentUser.active === false) {
    res.status(403).json('Konto je zablokované')
    return null
  }
  return currentUser
}

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await requireUser(req, res)
  if (!currentUser) return null
  if (!currentUser.isAdmin) {
    res.status(403).json('Len pre správcu')
    return null
  }
  return currentUser
}
