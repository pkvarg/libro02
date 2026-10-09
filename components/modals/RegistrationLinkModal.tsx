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


  const config = {
    headers: {
      'Content-Type': 'application/json',
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
        <p className='py-4 text-center text-ink-muted'>Overujeme odkaz…</p>
      )}
      {isDisabled === true && (
        <p className='rounded-xl bg-danger-soft p-4 text-center font-semibold text-danger'>
          Link expiroval!
        </p>
      )}
      {isDisabled === false && (
        <p className='rounded-xl bg-success-soft p-4 text-center font-display text-xl font-semibold text-success'>
          Registrácia bola úspešná!
        </p>
      )}
    </div>
  )

  return (
    <Modal
      // disabled={isDisabled}
      isOpen={registrationLinkModal.isOpen}
      title='Vaša registrácia'
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
