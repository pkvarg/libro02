import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
import usePasswordModal from '@/hooks/usePasswordModal'
import { useRouter } from 'next/router'
import Input from '../Input'
import Modal from '../Modal'

const PasswordModal = () => {
  const passwordModal = usePasswordModal()

  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const currentURL = `${window.location.origin}`
    setUrl(currentURL)
  }, [url])

  const bearerToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN

  const onSubmit = useCallback(async () => {
    setIsLoading(true)
    if (email !== '') {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }

        console.log(email, url, config)

        const { data } = await axios.post(
          '/api/auth/forgotPassword',
          {
            email,
            url,
          },
          config
        )

        localStorage.setItem('token', JSON.stringify(data))
        setIsLoading(false)

        toast.success('Link odoslaný na zadaný email.')
        passwordModal.onClose()
      } catch (error) {
        toast.error('Nastala chyba')
        console.log(error)
      }
    } else {
      setIsLoading(false)
      toast.error('Skontrolujte údaje')
    }
  }, [email])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Input
        disabled={isLoading}
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={passwordModal.isOpen}
      title='Zabudnuté heslo'
      actionLabel='Poslať link'
      onClose={passwordModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default PasswordModal
