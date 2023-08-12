'use client'

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2'
import MessageInput from './MessageInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { CldUploadButton } from 'next-cloudinary'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Form = () => {
  const router = useRouter()
  const { conversationId } = router.query

  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  })

  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //   setValue('message', '', { shouldValidate: true })
  //   axios.post('/api/messages', {
  //     ...data,
  //     conversationId: conversationId,
  //   })
  // }

  const onSubmit = () => {
    axios.post('/api/messages', {
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
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset='ug3mdafi'
      >
        <HiPhoto size={30} className='text-sky-500' />
      </CldUploadButton>
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
        className='text-black px-2 rounded-xl'
        id='message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        //errors={errors}
        required
        placeholder='Napíšte správu'
      />
      <button
        onClick={onSubmit}
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
      {/* </form> */}
    </div>
  )
}

export default Form
