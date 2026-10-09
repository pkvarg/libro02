// Links in e-mails must point to our own site, never to an origin sent by the browser.
const ALLOWED_ORIGINS = [
  'https://librosophia.sk',
  'https://www.librosophia.sk',
  'http://localhost:3000',
]

export default function siteUrl(requested?: unknown): string {
  if (typeof requested === 'string' && ALLOWED_ORIGINS.includes(requested.replace(/\/$/, ''))) {
    return requested.replace(/\/$/, '')
  }
  return 'https://librosophia.sk'
}
