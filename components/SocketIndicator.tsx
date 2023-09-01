'use client'

import { useSocket } from '@/components/providers/SocketProvider'
//import { Badge } from '@/components/ui/badge'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()
  console.log(isConnected)

  if (!isConnected) {
    return <p className='bg-yellow-600 text-white border-none px-2'>Offline </p>
  }

  return (
    // <Badge variant='outline' className='bg-emerald-600 text-white border-none'>
    //   Live: Real-time updates
    // </Badge>
    <p className='bg-emerald-600 text-white border-none px-2'>Live</p>
  )
}
