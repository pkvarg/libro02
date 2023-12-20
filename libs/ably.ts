'use client'
import Ably from 'ably/promises'

const randomId = Math.random().toString(36).slice(-10)
let savedEmail: string
if (typeof localStorage !== 'undefined') {
  savedEmail = localStorage.getItem('loggedInEmail')
  console.log('ablyreadsavedemail', savedEmail)
}

export const ably = new Ably.Realtime.Promise({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: savedEmail || null,
})
