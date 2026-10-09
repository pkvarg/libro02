import { NextApiRequest } from 'next'

// Best-effort, per-instance limiter for login, registration and password reset.
// Serverless instances do not share memory, so a Cloudflare rate-limiting rule is the real guard.
const hits = new Map<string, number[]>()

export const clientIp = (req: Pick<NextApiRequest, 'headers'> | { headers?: Record<string, any> }) => {
  const headers = (req.headers || {}) as Record<string, string | string[] | undefined>
  const value = headers['cf-connecting-ip'] || headers['x-real-ip'] || headers['x-forwarded-for'] || ''
  return (Array.isArray(value) ? value[0] : value).split(',')[0].trim() || 'unknown'
}

export default function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((time) => now - time < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    hits.forEach((times, k) => {
      if (times.every((time) => now - time >= windowMs)) hits.delete(k)
    })
  }
  return recent.length > limit
}
