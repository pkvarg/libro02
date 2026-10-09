'use client'

import { useEffect, useState } from 'react'

export default function Counter() {
  // eslint-disable-next-line
  const [loading, setLoading] = useState<boolean>(false)
  // eslint-disable-next-line
  const [error, setError] = useState<string | null>(null)

  const [countVisitors, setCountVisitors] = useState(0)
  //const [countBots, setCountBots] = useState(0)
  //const [countEmails, setCountEmails] = useState(0)
  const [lastVisit, setLastVisit] = useState('')

  const apiUrl = 'https://hono-api.pictusweb.com/api/stats/librosophia'
  //const apiUrl = 'http://localhost:3013/api/stats/librosophia'

  useEffect(() => {
    const getStats = async () => {
      try {
        // A plain GET (no custom headers) avoids a CORS preflight.
        const response = await fetch(apiUrl)

        const data = await response.json()

        //const date = data.lastVisitor_at.split('T')[0]
        const date = data.lastVisitor_at

        //setCountBots(data.bots)
        setCountVisitors(data.visitors)
        //setCountEmails(data.emails)
        setLastVisit(date)
      } catch (err) {
        // The stats API only allows librosophia.sk, so this fails on localhost.
        console.warn('Štatistiky návštev nie sú dostupné:', err)
        setError('Štatistiky návštev nie sú dostupné.')
      }
    }

    getStats()
  }, [])

  return (
    <div className="card mt-4 grid grid-cols-2 gap-4 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Počet návštev</p>
        <p className="font-display text-2xl font-semibold text-ink">{countVisitors}</p>
      </div>
      <div>
        {/* <p className="text-2xl font-bold mt-2">Roboti: {countBots}</p>
        <p className="text-2xl font-bold mt-2">Emaily : {countEmails}</p> */}
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Posledná návšteva</p>
        <p className="mt-1 text-sm text-ink">{lastVisit}</p>
      </div>

      {error && (
        <div className="col-span-2 rounded-lg bg-danger-soft p-3 text-danger">
          {error}
        </div>
      )}
    </div>
  )
}
