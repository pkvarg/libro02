'use client'
import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaShare } from 'react-icons/fa'
import useLoginModal from '@/hooks/useLoginModal'
import useCurrentUser from '@/hooks/useCurrentUser'

const SidebarTweetButton = () => {
  const router = useRouter()
  const loginModal = useLoginModal()
  const { data: currentUser } = useCurrentUser()

  const onClick = useCallback(() => {
    loginModal.onOpen()
  }, [loginModal])

  // const onClick = useCallback(() => {
  //   if (!currentUser) {
  //     return loginModal.onOpen()
  //   }

  //   router.push('/')
  // }, [loginModal, router, currentUser])

  return (
    <div onClick={onClick}>
      <div className='mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-sky-500 hover:bg-opacity-80 transition cursor-pointer'>
        <FaShare size={24} color='white' />
      </div>
      <div className='mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-80 transition cursor-pointer'>
        <p className='hidden lg:block text-center font-semibold text-white text-[20px]'>
          Zdieľať
        </p>
      </div>
    </div>
  )
}

export default SidebarTweetButton
