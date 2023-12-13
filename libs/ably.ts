import Ably from 'ably/promises'

const randomId = Math.random().toString(36).slice(-10)

export const ably = new Ably.Realtime.Promise({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: randomId, // Your ID in the presence set
})
