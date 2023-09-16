'use client'

import { useSocket } from '@/components/providers/SocketProvider'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return <p className='bg-yellow-600 text-white border-none px-2'>Offline </p>
  }

  return <p className='bg-emerald-600 text-white border-none px-2'>Live</p>
}
