'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { FullMessageType } from '@/types'

import AvatarChat from '@/components/AvatarChat'
import ImageModal from './ImageModal'
import { BsTrash } from 'react-icons/bs'
import axios from 'axios'
import DeleteAlert from '@/components/alerts/DeleteAlert'
import { toast } from 'react-hot-toast'

interface MessageBoxProps {
  data: FullMessageType
  isLast?: boolean
  rerender: () => void
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast, rerender }) => {
  const session = useSession()
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [showDeleteOption, setShowDeleteOption] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const isOwn = session.data?.user?.email === data?.sender?.email
  const seenList = (data?.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ')

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end')
  const avatar = clsx(isOwn && 'order-2')
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end')
  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100 text-black',
    data?.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  )

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await axios.delete(`/api/messages/deleteOne/${messageId}`)
      if (res.data === 'OK') {
        setShowDeleteOption(false)
        setShowAlert(false)
        // Update the key to trigger a re-render
        toast.success('Správa vymazaná')
        rerender()
      }
    } catch (error) {
      console.log(error)
      if (error.message === 'Request failed with status code 400')
        toast.error('Už vymazané')
    }
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  return (
    <div className={container}>
      <div className={avatar}>
        <AvatarChat user={data?.sender} />
      </div>
      <div className={body}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{data?.sender.name}</div>
          <div className='text-xs text-gray-400'>
            {data && format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data?.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data?.image ? (
            <Image
              alt='Image'
              height='288'
              width='288'
              onClick={() => setImageModalOpen(true)}
              src={data?.image}
              className='
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              '
            />
          ) : (
            <div
              onClick={() => setShowDeleteOption((prev) => !prev)}
              className={isOwn.toString() === 'true' && 'cursor-pointer'}
            >
              {data?.body}
            </div>
          )}
          {isOwn && showDeleteOption && (
            <p onClick={() => setShowAlert(true)} className='cursor-pointer'>
              <BsTrash className='text-red-600' />
            </p>
          )}
          {showAlert && (
            <DeleteAlert
              onDelete={() => handleDeleteMessage(data.id)}
              onCancel={handleCancel}
            />
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className='
            text-xs 
            font-light 
            text-[#6b7280]
            '
          >
            {`Videné užívateľom ${seenList}`}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBox
