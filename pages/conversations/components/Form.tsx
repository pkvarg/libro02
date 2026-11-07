'use client'

import { HiPaperAirplane } from 'react-icons/hi2'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { ably } from '@/libs/ably'

const Form = ({ message, setMessage }) => {
  const router = useRouter()
  const { conversationId } = router.query

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId,
    })
  }

  const [formData, setFormData] = useState('')
  // A ref guards against double clicks and Enter presses before the state re-renders.
  const sendingRef = useRef(false)
  const [isSending, setIsSending] = useState(false)

  const handleChange = (e: any) => {
    setFormData(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (sendingRef.current || !formData.trim()) return
    sendingRef.current = true
    setIsSending(true)
    try {
      await axios.post('/api/messages', {
        formData,
        conversationId: conversationId,
      })
      setMessage(formData)
      setFormData('')
      const channel = ably.channels.get(conversationId.toString())
      await channel.publish('your-event', message)
    } catch (error) {
      // The text stays in the field so it can be sent again.
      toast.error('Správu sa nepodarilo odoslať')
    } finally {
      sendingRef.current = false
      setIsSending(false)
    }
  }

  return (
    <div className="border-t border-line bg-surface px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] md:px-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          className="input rounded-full py-2.5"
          id="message"
          value={formData}
          onChange={handleChange}
          readOnly={isSending}
          required
          autoComplete="off"
          aria-label="Správa"
          placeholder="Napíšte správu"
        />
        <button
          type="submit"
          disabled={isSending || !formData.trim()}
          aria-busy={isSending}
          className="btn btn-primary h-11 w-11 shrink-0 px-0"
          aria-label={isSending ? 'Odosiela sa' : 'Odoslať'}
        >
          {isSending ? <ClipLoader size={16} color="#ffffff" /> : <HiPaperAirplane size={18} />}
        </button>
      </form>
    </div>
  )
}

export default Form
