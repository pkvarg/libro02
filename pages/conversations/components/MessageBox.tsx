'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'
import useCurrentUser from '@/hooks/useCurrentUser'
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
  const { data: currentUser } = useCurrentUser()
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [showDeleteOption, setShowDeleteOption] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const isOwn = !!currentUser?.id && currentUser.id === data?.sender?.id
  const seenList = (data?.seen || [])
    .filter((user) => user.id !== data?.sender?.id)
    .map((user) => user.name)
    .join(', ')

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
    <div className={clsx('flex items-end gap-2 px-3 py-1 md:px-5', isOwn && 'justify-end')}>
      {!isOwn && <AvatarChat user={data?.sender} />}
      <div className={clsx('flex max-w-[78%] flex-col gap-1', isOwn && 'items-end')}>
        <div className={clsx('flex items-center gap-1', isOwn && 'flex-row-reverse')}>
          {data?.image ? (
            <div className="overflow-hidden rounded-2xl">
              <Image
                alt="Obrázok v správe"
                height="288"
                width="288"
                onClick={() => setImageModalOpen(true)}
                src={data?.image}
                className="cursor-pointer object-cover transition hover:opacity-90"
              />
            </div>
          ) : (
            <div
              onClick={() => isOwn && setShowDeleteOption((prev) => !prev)}
              className={clsx(
                'whitespace-pre-line break-words rounded-2xl px-3.5 py-2 text-[15px] leading-snug',
                isOwn ? 'cursor-pointer rounded-br-md bg-brand text-white' : 'rounded-bl-md bg-sunken text-ink'
              )}
            >
              {data?.body}
            </div>
          )}
          {isOwn && showDeleteOption && (
            <button
              type="button"
              onClick={() => setShowAlert(true)}
              className="icon-btn h-9 w-9 hover:bg-danger-soft hover:text-danger"
              aria-label="Vymazať správu"
            >
              <BsTrash size={15} />
            </button>
          )}
        </div>
        <div className="px-1 text-[11px] text-ink-muted">
          {data && format(new Date(data.createdAt), 'p', { locale: sk })}
          {isLast && isOwn && seenList.length > 0 && ` · Videné užívateľom ${seenList}`}
        </div>
        <ImageModal src={data?.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
        {showAlert && (
          <DeleteAlert
            title="Naozaj chcete vymazať správu?"
            onDelete={() => handleDeleteMessage(data.id)}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default MessageBox
