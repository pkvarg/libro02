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


  const onSubmit = useCallback(async () => {
    setIsLoading(true)
    if (email !== '') {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
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

        toast.success('Ak je e-mail zaregistrovaný, poslali sme naň odkaz na zmenu hesla.', { duration: 6000 })
        forgotPasswordModal.onClose()
      } catch (error: any) {
        const message = error?.response?.data
        toast.error(typeof message === 'string' && message ? message : 'Nastala chyba')
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
      toast.error('Skontrolujte údaje')
    }
  }, [email])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft">Pošleme vám e-mail s odkazom na nastavenie nového hesla.</p>
      <Input
        disabled={isLoading}
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="vas@email.sk"
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
