'use client'
import React, { useCallback, useState } from 'react'
import useLoginModal from '@/hooks/useLoginModal'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import useRegisterModal from '@/hooks/useRegisterModal'
import usePasswordModal from '@/hooks/usePasswordModal'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const LoginModal = () => {
  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()
  const passwordModal = usePasswordModal()

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
    passwordModal.onOpen()
  }, [loginModal, passwordModal])

  const onSubmit = useCallback(async () => {
    if (email !== '' && password !== '') {
      try {
        setIsLoading(true)

        await signIn('credentials', {
          email,
          password,
        })

        toast.success('Úspešné prihlásenie')

        loginModal.onClose()
      } catch (error) {
        console.log(error, 'Nastala chyba')
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
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
      />
      <Input
        placeholder='Heslo'
        type='password'
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
    </div>
  )

  const footerContent = (
    <div className='text-neutral-400 text-center mt-4'>
      <p>
        Ste tu prvý krát?
        <span
          onClick={onToggle}
          className='
            text-white 
            cursor-pointer 
            hover:underline
          '
        >
          {' '}
          Vytvoriť účet
        </span>
      </p>
      <p>
        Zabudli ste heslo?
        <span
          onClick={forgotPassword}
          className='
            text-white 
            cursor-pointer 
            hover:underline
          '
        >
          {' '}
          Poslať link
        </span>
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
