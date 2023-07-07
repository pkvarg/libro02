import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'

import useLoginModal from '@/hooks/useLoginModal'
import useRegisterModal from '@/hooks/useRegisterModal'

import Input from '../Input'
import Modal from '../Modal'

const RegisterModal = () => {
  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const onToggle = useCallback(() => {
    if (isLoading) {
      return
    }

    registerModal.onClose()
    loginModal.onOpen()
  }, [loginModal, registerModal, isLoading])

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)

      await axios.post('/api/register', {
        email,
        password,
        username,
        name,
      })

      /* test email API*/
      await axios.post('/api/email', {
        email,
        username,
        name,
      })

      setIsLoading(false)

      toast.success('Účet vytvorený.')

      signIn('credentials', {
        email,
        password,
      })

      registerModal.onClose()
    } catch (error) {
      toast.error('Nastala chyba')
    } finally {
      setIsLoading(false)
    }
  }, [email, password, registerModal, username, name])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Input
        disabled={isLoading}
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        disabled={isLoading}
        placeholder='Meno'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        disabled={isLoading}
        placeholder='Užívateľské meno'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        disabled={isLoading}
        placeholder='Heslo'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  )

  const footerContent = (
    <div className='text-neutral-400 text-center mt-4'>
      <p>
        Už máte svoj účet?
        <span
          onClick={onToggle}
          className='
            text-white 
            cursor-pointer 
            hover:underline
          '
        >
          {' '}
          Prihlásiť sa
        </span>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title='Vytvoriť účet'
      actionLabel='Registrovať'
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal
