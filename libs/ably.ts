'use client'
import Ably from 'ably/promises'

// Tokens come from /api/ably, which checks the session; the API key never reaches the browser.
export const ably = new Ably.Realtime.Promise({
  authUrl: '/api/ably',
  autoConnect: typeof window !== 'undefined',
})

// A conversation created after the current token was issued is not in its capability,
// so the conversation page asks for a fresh token before subscribing.
let pendingRefresh: Promise<unknown> | null = null
export const refreshAblyToken = () => {
  if (!pendingRefresh) {
    pendingRefresh = ably.auth
      .authorize()
      .catch((error) => console.log(error))
      .finally(() => {
        pendingRefresh = null
      })
  }
  return pendingRefresh
}
