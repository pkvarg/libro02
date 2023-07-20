import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
import useResetPasswordModal from '@/hooks/useResetPasswordModal'
import useForgotPasswordModal from '@/hooks/useForgotPasswordModal'
import Input from '../Input'
import Modal from '../Modal'
import { useRouter } from 'next/router'

const ResetPasswordModal = () => {
  const router = useRouter()
  const route = router.route
  const resetPasswordPathname = route.includes('resetPassword')
  console.log('rPM:', resetPasswordPathname)
  const slug = router.query.slug
  const resetPasswordModal = useResetPasswordModal()
  const forgotPasswordModal = useForgotPasswordModal()
  const [email, setEmail] = useState<string | undefined>()
  const [token, setToken] = useState<string | undefined>()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
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
    if (!resetPasswordPathname) {
      resetPasswordModal.onClose()
    }
  }, [resetPasswordPathname])

  useEffect(() => {
    if (email !== undefined && token !== undefined) {
      const checkToken = async () => {
        try {
          const { data } = await axios.post(
            '/api/checkResetToken',
            {
              email,
              token,
            },
            config
          )
          if (data === true) {
            setIsDisabled(false)
          } else {
            toast.error('Link pravdepodobne expiroval')
            setIsDisabled(true)
            resetPasswordModal.onClose()
          }
        } catch (error) {
          console.log(error)
        }
      }
      checkToken()
    }
  }, [email, token])

  const onSubmit = useCallback(async () => {
    if (
      password !== '' &&
      passwordConfirm !== '' &&
      password === passwordConfirm &&
      isDisabled === false
    ) {
      try {
        setIsLoading(true)

        const bearerToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }

        await axios.post(
          '/api/passwordReset',
          {
            email,
            password,
          },
          config
        )

        setIsLoading(false)

        toast.success('Heslo úspešne zmenené.')

        resetPasswordModal.onClose()
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
  }, [email, password, passwordConfirm])

  const sendLinkAgain = () => {
    resetPasswordModal.onClose()
    forgotPasswordModal.onOpen()
  }

  const bodyContent = (
    <div className='flex flex-col gap-4 '>
      {isDisabled === undefined && ''}
      {isDisabled === true && (
        <div className='flex gap-4 items-center'>
          <h1 className='text-[#b33a3a] text-center'>Link expiroval!</h1>

          <button
            className='cursor-pointer text-[25px]'
            onClick={sendLinkAgain}
          >
            Odoslať link znova
          </button>
        </div>
      )}

      <input
        disabled
        defaultValue={email}
        className='
          w-full
          p-4 
          text-lg 
          bg-black 
          border-2
          border-neutral-800 
          rounded-md
          outline-none
          text-white
          focus:border-sky-500
          focus:border-2
          transition
          disabled:bg-neutral-900
          disabled:opacity-70
          disabled:cursor-not-allowed
        '
      />

      <Input
        disabled={isDisabled}
        placeholder='Heslo'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        disabled={isDisabled}
        placeholder='Opakovať heslo'
        type='password'
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
    </div>
  )

  return (
    <Modal
      disabled={isDisabled}
      isOpen={resetPasswordModal.isOpen}
      title='Zmeniť Heslo'
      actionLabel='Zmeniť heslo'
      onClose={resetPasswordModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default ResetPasswordModal
