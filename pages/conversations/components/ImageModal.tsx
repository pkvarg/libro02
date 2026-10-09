'use client'

import Modal from '@/pages/conversations/components/Modal'
import Image from 'next/image'

interface ImageModalProps {
  isOpen?: boolean
  onClose: () => void
  src?: string | null
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='relative mx-auto h-80 w-80 max-w-full'>
        <Image className='rounded-xl object-contain' fill alt='Obrázok v správe' src={src} />
      </div>
    </Modal>
  )
}

export default ImageModal
