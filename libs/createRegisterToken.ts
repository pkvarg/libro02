import crypto from 'crypto'

export default async function createRegisterToken(email: string, url: String) {
  const token = crypto.randomBytes(32).toString('hex')
  const registerToken = crypto.createHash('sha256').update(token).digest('hex')

  const date = new Date()
  const expiryDate = new Date(date.getTime() + 15 * 60000)
  const registerTokenExpires = expiryDate.toISOString().replace('Z', '+00:00')

  const registerURL: string = `${url}/registerLink/${token}/${email}`

  const data = {
    email,
    registerToken,
    registerTokenExpires,
    token,
    registerURL,
  }

  return data
}
