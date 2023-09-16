'use client'

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2'
import MessageInput from './MessageInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { CldUploadButton } from 'next-cloudinary'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import EmojiPicker from './EmojiPicker'
import { useSocket } from '../../../components/providers/SocketProvider'
import { socketHttp } from '@/lib/socketHttp'

const Form = ({ message, setMessage }) => {
  const router = useRouter()
  const { conversationId } = router.query
  const { isConnected } = useSocket()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    socketHttp.emit('sendMessage', message, conversationId)

    const res = await axios.post('/api/messages', {
      message,
      conversationId: conversationId,
    })
    setMessage('')
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId,
    })
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
      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-2 lg:gap-4 w-full'
      > */}
      {/* <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder='Napíšte správu'
        /> */}
      <input
        className='text-black px-2 rounded-xl w-full h-8'
        id='message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        //errors={errors}
        required
        placeholder='Napíšte správu'
      />
      <button
        onClick={(e) => onSubmit(e)}
        //type='submit'
        className='
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          '
      >
        <HiPaperAirplane size={18} className='text-white' />
      </button>
      <div className=''>
        {/* <EmojiPicker
          onChange={(emoji: string) => setMessage((prev) => prev + emoji)}
        /> */}
      </div>
      {/* </form> */}
    </div>
  )
}

export default Form
