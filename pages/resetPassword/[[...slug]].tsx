import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import useResetPasswordModal from '@/hooks/useResetPasswordModal'

const page = () => {
  const resetPasswordModal = useResetPasswordModal()
  const router = useRouter()
  const slug = router.query.slug

  const token = slug?.[0]
  const email = slug?.[1]

  useEffect(() => {
    resetPasswordModal.onOpen()
  }, [email, token])

  return (
    <div className='m-2 text-[#9ca3af]'>
      <h1 className='text-[35px] text-center'>Obnova hesla</h1>
    </div>
  )
}

export default page
