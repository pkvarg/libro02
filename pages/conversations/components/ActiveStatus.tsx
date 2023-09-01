'use client'

import { SocketIndicator } from '@/components/SocketIndicator'

export const ActiveStatus = () => {
  return (
    <div className='ml-auto flex items-center'>
      <SocketIndicator />
    </div>
  )
}
