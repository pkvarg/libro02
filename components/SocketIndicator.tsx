'use client'

// import { useSocket } from '@/components/providers/SocketProvider'
import useSocket from '@/hooks/useSocket'

export const SocketIndicator = () => {
  const { socketConnected } = useSocket()

  if (!socketConnected) {
    return <p className='bg-yellow-600 text-white border-none px-2'>Offline </p>
  }

  return <p className='bg-emerald-600 text-white border-none px-2'>Live</p>
}
