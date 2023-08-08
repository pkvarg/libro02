'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { FullMessageType } from '@/types'

import AvatarChat from '@/components/AvatarChat'
//import ImageModal from './ImageModal'

interface MessageBoxProps {
  data: FullMessageType
  isLast?: boolean
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession()
  const [imageModalOpen, setImageModalOpen] = useState(false)

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
          <h1>ImageModal!!!</h1>
          {/* <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          /> */}
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
            <div>{data?.body}</div>
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
