'use client'

import { HiPaperAirplane } from 'react-icons/hi2'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
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

  const handleChange = (e: any) => {
    setFormData(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await axios.post('/api/messages', {
      formData,
      conversationId: conversationId,
    })
    setMessage(formData)
    const channel = ably.channels.get(conversationId.toString())
    await channel.publish('your-event', message)

    setFormData('')
  }

  return (
    <div className="border-t border-line bg-surface px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] md:px-5">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          className="input rounded-full py-2.5"
          id="message"
          value={formData}
          onChange={handleChange}
          required
          autoComplete="off"
          aria-label="Správa"
          placeholder="Napíšte správu"
        />
        <button type="submit" className="btn btn-primary h-11 w-11 shrink-0 px-0" aria-label="Odoslať">
          <HiPaperAirplane size={18} />
        </button>
      </form>
    </div>
  )
}

export default Form
