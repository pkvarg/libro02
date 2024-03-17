import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import useRegistrationLinkModal from '@/hooks/useRegistrationLinkModal'
import useRegisterModal from '@/hooks/useRegisterModal'

import Modal from '../Modal'
import { useRouter } from 'next/router'
import useLoginModal from '@/hooks/useLoginModal'

const RegistrationLinkModal = () => {
  const router = useRouter()
  const slug = router.query.slug
  const route = router.route
  const registerLinkPathname = route.includes('registerLink')
  const registrationLinkModal = useRegistrationLinkModal()
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const [email, setEmail] = useState<string | undefined>()
  const [token, setToken] = useState<string | undefined>()

  const [isDisabled, setIsDisabled] = useState<boolean | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(false)

  const bearerToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }

  useEffect(() => {
    const slugToken = slug?.[0]
    const slugEmail = slug?.[1]
    setToken(slugToken)
    setEmail(slugEmail)
  }, [slug, email])

  useEffect(() => {
    if (registerLinkPathname) {
      const checkToken = async () => {
        try {
          const data = await axios.post(
            '/api/checkRegistrationToken',
            {
              email,
              token,
            },
            config
          )
          console.log('dataCheckRegTok', data)
          if (data.data === true) {
            setIsDisabled(false)
          } else {
            toast.error('Link pravdepodobne expiroval')
            setIsDisabled(true)
            registrationLinkModal.onClose()
          }
        } catch (error) {
          console.log(error)
        }
      }
      checkToken()
    }
  }, [email, token])

  const logIn = () => {
    registrationLinkModal.onClose()
    router.push('/')
    loginModal.onOpen()
  }

  const registerAgain = () => {
    registrationLinkModal.onClose()

    registerModal.onOpen()
  }

  const bodyContent = (
    <div className='flex flex-col gap-4 '>
      {isDisabled === undefined && (
        <h1 className='text-center text-[27.5px]'>................</h1>
      )}
      {isDisabled === true && (
        <div className='flex flex-col gap-4 items-center'>
          <h1 className='text-[#b33a3a] text-center text-[27.5px]'>
            Link expiroval!
          </h1>
        </div>
      )}
      {isDisabled === false && (
        <h1 className='text-[35px] text-green-600 text-center'>
          Registrácia bola úspešná!
        </h1>
      )}
    </div>
  )

  return (
    <Modal
      // disabled={isDisabled}
      isOpen={registrationLinkModal.isOpen}
      title='Vaša Registrácia'
      actionLabel={
        isDisabled ? ' Opakovať registráciu' : 'Pokračovať k prihláseniu'
      }
      onClose={registrationLinkModal.onClose}
      onSubmit={isDisabled ? registerAgain : logIn}
      body={bodyContent}
    />
  )
}

export default RegistrationLinkModal
