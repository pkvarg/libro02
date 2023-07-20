import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
import useRegistrationLinkModal from '@/hooks/useRegistrationLinkModal'
import useRegisterModal from '@/hooks/useRegisterModal'

import Input from '../Input'
import Modal from '../Modal'
import Button from '../Button'
import { useRouter } from 'next/router'

const RegistrationLinkModal = () => {
  const router = useRouter()
  const slug = router.query.slug
  const route = router.route
  const registerLinkPathname = route.includes('registerLink')
  console.log('rLM:', registerLinkPathname)
  const registrationLinkModal = useRegistrationLinkModal()
  const registerModal = useRegisterModal()
  const [email, setEmail] = useState<string | undefined>()
  const [token, setToken] = useState<string | undefined>()

  const [isDisabled, setIsDisabled] = useState<boolean>(true)

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

  const onSubmit = useCallback(async () => {
    if (isDisabled === false) {
      try {
        setIsLoading(true)

        const bearerToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }

        /*
        SingIn
        */

        setIsLoading(false)

        toast.success('Úspešné prihlásenie.')

        registrationLinkModal.onClose()
        router.push('/')
      } catch (error) {
        toast.error('Nastala chyba')
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Skontrolujte údaje')
    }
  }, [email])

  const registerAgain = () => {
    registrationLinkModal.onClose()
    registerModal.onOpen()
  }

  const bodyContent = (
    <div className='flex flex-col gap-4 '>
      {isDisabled && (
        <div className='flex flex-col gap-4 items-center'>
          <h1 className='text-[#b33a3a] text-center'>Link expiroval!</h1>

          <button
            className='cursor-pointer text-[25px]'
            onClick={registerAgain}
          >
            Opakovať registráciu
          </button>
        </div>
      )}

      <h1 className='text-[35px] text-green-600 text-center'>
        Registrácia bola úspešná!
      </h1>
    </div>
  )

  return (
    <Modal
      disabled={isDisabled}
      isOpen={registrationLinkModal.isOpen}
      title='Vaša Registrácia'
      actionLabel='Pokračovať k prihláseniu'
      onClose={registrationLinkModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default RegistrationLinkModal
