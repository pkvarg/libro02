import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useCallback, useState, useEffect } from 'react'

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
  const [consentBox, setConsentBox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    const currentURL = `${window.location.origin}`
    setUrl(currentURL)
  }, [url])

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
    } else if (consentBox !== true) {
      return toast.error('Musíte potvrdiť súhlas so spracúvaním osobných údajov')
    } else if (
      checkedBox === true &&
      email !== '' &&
      password !== '' &&
      username !== '' &&
      name !== ''
    ) {
      try {
        setIsLoading(true)


        await axios.post(
          '/api/register',
          {
            email,
            password,
            username,
            name,
            url,
            consent: true,
          },
          { headers: { 'Content-Type': 'application/json' } },
        )
        // Same message for new and already registered e-mails, so the form reveals nothing.
        toast.success('Ak tento e-mail ešte nie je zaregistrovaný, poslali sme naň registračný link.', {
          duration: 6000,
        })

        setIsLoading(false)

        registerModal.onClose()
      } catch (error: any) {
        const message = error?.response?.data
        toast.error(typeof message === 'string' && message ? message : 'Nastala chyba')
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Skontrolujte údaje')
    }
  }, [email, password, registerModal, username, name, checkedBox, consentBox])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        disabled={isLoading}
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="vas@email.sk"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        disabled={isLoading}
        label="Meno"
        autoComplete="name"
        placeholder="Meno a priezvisko"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        disabled={isLoading}
        label="Užívateľské meno"
        autoComplete="username"
        placeholder="napr. jan.novak"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        disabled={isLoading}
        label="Heslo"
        placeholder="Heslo"
        autoComplete="new-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="mt-1 flex items-start gap-3">
        <input
          id="rulesBox"
          className="mt-0.5 h-5 w-5 flex-shrink-0 accent-brand"
          checked={checkedBox}
          type="checkbox"
          onChange={() => setCheckedBox((prev) => !prev)}
        />
        <label className="text-sm leading-snug text-ink-soft" htmlFor="rulesBox">
          Súhlasím s{' '}
          <a href="/rules" target="_blank" className="link underline">
            pravidlami siete
          </a>
        </label>
      </div>
      {/* Explicit consent (čl. 9 ods. 2 písm. a) GDPR): membership and posts may reveal religious belief. */}
      <div className="flex items-start gap-3">
        <input
          id="consentBox"
          className="mt-0.5 h-5 w-5 flex-shrink-0 accent-brand"
          checked={consentBox}
          type="checkbox"
          onChange={() => setConsentBox((prev) => !prev)}
        />
        <label className="text-sm leading-snug text-ink-soft" htmlFor="consentBox">
          Mám aspoň 16 rokov a výslovne súhlasím, aby prevádzkovateľ spracúval moje údaje vrátane
          tých, z ktorých môže vyplývať moje náboženské presvedčenie, na účely členstva v sieti.
          Súhlas môžem kedykoľvek odvolať zrušením konta. Viac v{' '}
          <a href="/privacy" target="_blank" className="link underline">
            zásadách ochrany osobných údajov
          </a>
          .
        </label>
      </div>
    </div>
  )

  const footerContent = (
    <div className="text-center text-sm text-ink-muted">
      <p>
        Už máte svoj účet?{' '}
        <button type="button" onClick={onToggle} className="link">
          Prihlásiť sa
        </button>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Vytvoriť účet"
      actionLabel="Registrovať"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal
