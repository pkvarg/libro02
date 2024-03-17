import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import useRegistrationLinkModal from '@/hooks/useRegistrationLinkModal'

const page = () => {
  const registrationLinkModal = useRegistrationLinkModal()
  const router = useRouter()
  const slug = router.query.slug
  const route = router.route
  const registerLinkPathname = route.includes('registerLink')

  const token = slug?.[0]
  const email = slug?.[1]

  useEffect(() => {
    if (registerLinkPathname) {
      registrationLinkModal.onOpen()
    }
  }, [email, token])

  return (
    <div className='m-2 text-[#9ca3af]'>
      <h1 className='text-[35px] text-center'>Registrácia</h1>
    </div>
  )
}

export default page
