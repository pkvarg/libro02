'use client'
import React, { useCallback, useState } from 'react'
import useLoginModal from '@/hooks/useLoginModal'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import useRegisterModal from '@/hooks/useRegisterModal'
import useForgotPasswordModal from '@/hooks/useForgotPasswordModal'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const LoginModal = () => {
  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()
  const forgotPasswordModal = useForgotPasswordModal()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const onToggle = useCallback(() => {
    loginModal.onClose()
    registerModal.onOpen()
  }, [loginModal, registerModal])

  const forgotPassword = useCallback(() => {
    loginModal.onClose()
    forgotPasswordModal.onOpen()
  }, [loginModal, forgotPasswordModal])

  const onSubmit = useCallback(async () => {
    if (email !== '' && password !== '') {
      try {
        setIsLoading(true)


        // The server decides; wrong password, unknown or unconfirmed account all get the same answer.
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok && !result.error) {
          toast.success('Úspešné prihlásenie')
          loginModal.onClose()
          window.location.reload()
        } else if (result?.error?.startsWith('Príliš veľa')) {
          toast.error(result.error)
        } else {
          toast.error('Nesprávny e-mail alebo heslo, alebo účet ešte nie je potvrdený')
        }
      } catch (error) {
        console.log(error, 'Nastala chyba')
        toast.error('Skontrolujte údaje')
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Skontrolujte údaje')
    }
  }, [email, password, loginModal])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Input
        label='Email'
        placeholder='vas@email.sk'
        type='email'
        autoComplete='email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
      />
      <Input
        label='Heslo'
        placeholder='Heslo'
        type='password'
        autoComplete='current-password'
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
    </div>
  )

  const footerContent = (
    <div className='flex flex-col gap-1 text-center text-sm text-ink-muted'>
      <p>
        Ste tu prvý krát?{' '}
        <button type='button' onClick={onToggle} className='link'>
          Vytvoriť účet
        </button>
      </p>
      <p>
        Zabudli ste heslo?{' '}
        <button type='button' onClick={forgotPassword} className='link'>
          Poslať link
        </button>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title='Prihlásenie'
      actionLabel='Prihlásiť sa'
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal
