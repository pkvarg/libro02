'use client'

import React, { useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios'
import { useRouter } from 'next/router'
import Modal from '@/pages/conversations/components/Modal'
import Button from '@/pages/conversations/components/Button'
import useConversation from '@/hooks/useConversation'
import { toast } from 'react-hot-toast'

interface ConfirmModalProps {
  isOpen?: boolean
  onClose: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { conversationId } = router.query
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = useCallback(() => {
    //setIsLoading(true)
    console.log(conversationId)

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose()
        router.push('/conversations')
        //router.reload()
      })
      .catch(() => toast.error('Nastala chyba!'))
      .finally(() => setIsLoading(false))
  }, [router, conversationId, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div
          className='
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-danger-soft 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          '
        >
          <FiAlertTriangle
            className='h-6 w-6 text-danger'
            aria-hidden='true'
          />
        </div>
        <div
          className='
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          '
        >
          <Dialog.Title
            as='h3'
            className='font-display text-lg font-semibold leading-6 text-ink'
          >
            Vymazať konverzáciu?
          </Dialog.Title>
          <div className='mt-2'>
            <p className='text-sm text-ink-muted'>
              Ste si istí, že chcete vymazať túto konverzáciu?
            </p>
          </div>
        </div>
      </div>
      <div className='mt-6 flex flex-col gap-2 sm:flex-row-reverse'>
        <Button disabled={false} danger onClick={onDelete}>
          Vymazať
        </Button>
        <Button disabled={false} secondary onClick={onClose}>
          Naspäť
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
