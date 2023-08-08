'use client'

import { useState, ChangeEvent } from 'react'
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { CldUploadButton } from 'next-cloudinary'
import { useRouter } from 'next/router'

const Form = () => {
  const router = useRouter()
  const { conversationId } = router.query

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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(message)
    // setValue('message', '', { shouldValidate: true })
    axios.post('/api/messages', {
      message,
      //...data,
      conversationId: conversationId,
    })
  }

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId,
    })
  }

  const [message, setMessage] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  return (
    <div
      className='
        py-4
        px-4
        bg-[#262626]
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-2 lg:gap-4 w-full'
      >
        <input
          id='message'
          value={message}
          //register={register}
          //errors={errors}
          required
          placeholder='Napíšte správu'
          onChange={handleChange}
        />
        <button
          type='submit'
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
      </form>
    </div>
  )
}

export default Form
