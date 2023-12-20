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

  const handleChange = (e) => {
    setFormData(e.target.value)
  }

  const handleSubmit = async (e) => {
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
    <div
      className='
        py-4 
        px-4 
         
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      '
    >
      <form
        onSubmit={handleSubmit}
        className='flex items-center gap-2 lg:gap-4 w-full'
      >
        <input
          className='text-black px-2 rounded-xl w-full h-8'
          id='message'
          value={formData}
          onChange={handleChange}
          required
          onFocus={null}
          placeholder='Napíšte správu'
        />
        <button
          type='submit'
          className='
            rounded-full
             p-2
            bg-sky-500
            cursor-pointer
             hover:bg-sky-600
            transition'
        >
          <HiPaperAirplane size={18} className='text-white' />
        </button>
        {/* <div className=''>
        <EmojiPicker
          onChange={(emoji: string) => setMessage((prev) => prev + emoji)}
        />
      </div> */}
      </form>
    </div>
  )
}

export default Form
