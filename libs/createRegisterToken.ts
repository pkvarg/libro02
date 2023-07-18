import crypto from 'crypto'

export default function createRegisterToken(email: String, url: String) {
  const token = crypto.randomBytes(32).toString('hex')
  const registerToken = crypto.createHash('sha256').update(token).digest('hex')

  const registerURL: string = `${url}/register/${registerToken}/${email}`

  const data = {
    registerToken,
    token,
    registerURL,
  }

  return data
}
