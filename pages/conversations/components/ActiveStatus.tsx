'use client'

import { SocketIndicator } from '@/components/SocketIndicator'

export default function ActiveStatus() {
  return (
    <div className='ml-auto flex items-center'>
      <SocketIndicator />
    </div>
  )
}

// export default { ActiveStatus }
