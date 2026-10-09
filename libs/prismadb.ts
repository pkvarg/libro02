import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const base = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = base

// Never sent to the browser: password hashes and registration / reset tokens.
const SECRET_FIELDS = new Set([
  'hashedPassword',
  'registerToken',
  'registerTokenExpires',
  'passwordResetToken',
  'passwordResetExpires',
])

const stripSecrets = (value: any): any => {
  if (Array.isArray(value)) return value.map(stripSecrets)
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const clean: Record<string, any> = {}
    for (const [key, field] of Object.entries(value)) {
      if (!SECRET_FIELDS.has(key)) clean[key] = stripSecrets(field)
    }
    return clean
  }
  return value
}

/**
 * Raw client for the few auth flows that must read password hashes or tokens
 * (login, registration, password reset). Never return its results to the client.
 */
export const prismaAuth = base

// Default client: strips secret fields from every result, including nested includes.
const client = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        return stripSecrets(await query(args))
      },
    },
  },
})

export default client
