import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
import useForgotPasswordModal from '@/hooks/useForgotPasswordModal'
import { useRouter } from 'next/router'
import Input from '../Input'
import Modal from '../Modal'

const ForgotPasswordModal = () => {
  const forgotPasswordModal = useForgotPasswordModal()

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

        await axios.post(
          '/api/forgotPassword',
          {
            email,
            url,
          },
          config,
        )

        setIsLoading(false)

        toast.success('Link odoslaný na zadaný email.')
        forgotPasswordModal.onClose()
      } catch (error) {
        toast.error('Nastala chyba')
        console.log(error)
        forgotPasswordModal.onClose()
      }
    } else {
      setIsLoading(false)
      toast.error('Skontrolujte údaje')
    }
  }, [email])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        disabled={isLoading}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotPasswordModal.isOpen}
      title="Zabudnuté heslo"
      actionLabel="Poslať link"
      onClose={forgotPasswordModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default ForgotPasswordModal
