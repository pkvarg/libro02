import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import useResetPasswordModal from '@/hooks/useResetPasswordModal'

const page = () => {
  const resetPasswordModal = useResetPasswordModal()
  const router = useRouter()
  const route = router.route
  const resetPasswordPathname = route.includes('resetPassword')
  const slug = router.query.slug

  const token = slug?.[0]
  const email = slug?.[1]

  if (true) {
    useEffect(() => {
      if (resetPasswordPathname) {
        resetPasswordModal.onOpen()
      } else {
        resetPasswordModal.onClose()
      }
    }, [email, token, resetPasswordPathname])
  }

  return (
    <div className='m-2 text-[#9ca3af]'>
      <h1 className='text-[35px] text-center'>Obnova hesla</h1>
    </div>
  )
}

export default page
