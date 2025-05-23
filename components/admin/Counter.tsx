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
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        //const date = data.lastVisitor_at.split('T')[0]
        const date = data.lastVisitor_at

        //setCountBots(data.bots)
        setCountVisitors(data.visitors)
        //setCountEmails(data.emails)
        setLastVisit(date)
      } catch (err) {
        console.error('Error fetching bots:', err)
      }
    }

    getStats()
  }, [])

  return (
    <div className="mt-8 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="mb-4">
        <p className="text-xl font-bold mt-2">Počet návštev: : {countVisitors}</p>
        {/* <p className="text-2xl font-bold mt-2">Roboti: {countBots}</p>
        <p className="text-2xl font-bold mt-2">Emaily : {countEmails}</p> */}
        <p className="text-md font-bold mt-2">Posledná návšteva: {lastVisit}</p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
