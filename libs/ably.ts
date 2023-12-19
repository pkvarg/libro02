import Ably from 'ably/promises'

const randomId = Math.random().toString(36).slice(-10)
const savedEmail = localStorage.getItem('loggedInEmail')
console.log('savedemail', savedEmail)

export const ably = new Ably.Realtime.Promise({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: savedEmail,
})
