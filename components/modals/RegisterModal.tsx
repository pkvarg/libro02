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
  const [checkedBox, setCheckedBox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onToggle = useCallback(() => {
    if (isLoading) {
      return
    }

    registerModal.onClose()
    loginModal.onOpen()
  }, [loginModal, registerModal, isLoading])

  const onSubmit = useCallback(async () => {
    if (checkedBox !== true) {
      return toast.error('Musíte potvrdiť súhlas s pravidlami siete')
    } else if (
      checkedBox === true &&
      email !== '' &&
      password !== '' &&
      username !== '' &&
      name !== ''
    ) {
      try {
        setIsLoading(true)

        await axios.post('/api/register', {
          email,
          password,
          username,
          name,
        })

        const bearerToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }

        /* sendgrid */
        await axios.post(
          '/api/send-email',
          {
            name,
            email,
          },
          config
        )

        /* test email API*/
        // await axios.post(
        //   '/api/email',
        //   {
        //     email,
        //     username,
        //     name,
        //   },
        //   config
        // )

        setIsLoading(false)

        toast.success('Účet vytvorený.')

        signIn('credentials', {
          email,
          password,
        })

        registerModal.onClose()
      } catch (error) {
        toast.error('Nastala chyba')
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Skontrolujte údaje')
    }
  }, [email, password, registerModal, username, name, checkedBox])

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
      <div className='flex ml-2 mt-2 items-center'>
        <input
          className='w-[20px] h-[20px]'
          checked={checkedBox}
          type='checkbox'
          onChange={() => setCheckedBox((prev) => !prev)}
        />
        <label
          className='form-check-label text-[#9ca3af] lg:text-[30px] text-[20px] ml-[15px]'
          htmlFor='flexCheckDefault'
        >
          Súhlasím s{' '}
          <a href='/rules' target='_blank' className='underline !text-sky-500'>
            pravidlami siete
          </a>
        </label>
      </div>
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
