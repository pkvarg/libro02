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
  const slug = router.query.slug
  const resetPasswordModal = useResetPasswordModal()
  const forgotPasswordModal = useForgotPasswordModal()
  const [email, setEmail] = useState<string | undefined>()
  const [token, setToken] = useState<string | undefined>()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
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


        const config = {
          headers: {
            'Content-Type': 'application/json',
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
        <div className='flex flex-wrap items-center gap-3 rounded-xl bg-danger-soft p-3'>
          <p className='font-semibold text-danger'>Link expiroval!</p>
          <button type='button' className='link ml-auto' onClick={sendLinkAgain}>
            Odoslať link znova
          </button>
        </div>
      )}

      <input disabled defaultValue={email} aria-label='Email' className='input' />

      <Input
        disabled={isDisabled}
        label='Nové heslo'
        placeholder='Heslo'
        autoComplete='new-password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        disabled={isDisabled}
        label='Zopakujte heslo'
        placeholder='Opakovať heslo'
        autoComplete='new-password'
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
      title='Zmeniť heslo'
      actionLabel='Zmeniť heslo'
      onClose={resetPasswordModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default ResetPasswordModal
