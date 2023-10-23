'use client'

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2'
import axios from 'axios'
import { CldUploadButton } from 'next-cloudinary'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

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
    // just to trigger conversations in cId
    setMessage(formData)

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
      {/* <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        <HiPhoto size={30} className='text-sky-500' />
      </CldUploadButton> */}
      <form
        // onSubmit={handleSubmit(onSubmit)}
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
