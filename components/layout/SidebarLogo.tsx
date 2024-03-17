'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaBookReader } from 'react-icons/fa'

const SidebarLogo = () => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push('/')}
      className='rounded-full h-14 w-14 p-4 flex items-center justify-center cursor-pointer transition'
    >
      <FaBookReader size={28} color='white' />
    </div>
  )
}

export default SidebarLogo
