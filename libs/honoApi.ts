import axios from 'axios'

const HONO_LIBROSOPHIA = 'https://hono-api.pictusweb.com/api/librosophia'

// hono-api sends mail from the Librosophia mailbox; the shared secret proves the call
// comes from this server (LIBROSOPHIA_INTERNAL_SECRET, same value on hono-api).
export const honoHeaders = () => ({
  'Content-Type': 'application/json',
  ...(process.env.LIBROSOPHIA_INTERNAL_SECRET
    ? { 'X-Internal-Token': process.env.LIBROSOPHIA_INTERNAL_SECRET }
    : {}),
})

export const callHono = (path: string, body: Record<string, unknown>) =>
  axios.put(`${HONO_LIBROSOPHIA}/${path}`, body, { headers: honoHeaders() })
