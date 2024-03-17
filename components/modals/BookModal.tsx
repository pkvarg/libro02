import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import useBookModal from '@/hooks/useBookModal'
import Input from '../Input'
import Modal from '../Modal'
import ImageUpload from '../ImageUpload'
import { CldUploadButton } from 'next-cloudinary'

import { useRouter } from 'next/router'

const BookModal = () => {
  const router = useRouter()
  const BookModal = useBookModal()
  const [bookImage, setBookImage] = useState<string>('')
  const [bookTitle, setBookTitle] = useState<string>('')
  const [bookAuthor, setBookAuthor] = useState<string>('')
  const [bookLendingDuration, setBookLendingDuration] = useState<string>('')
  const [bookReview, setBookReview] = useState<string>('')

  const [isLoading, setIsLoading] = useState(false)

  const handleUploadBookImage = (result: any) => {
    setBookImage(result.info.secure_url)
  }

  const onSubmit = useCallback(async () => {
    if (
      bookTitle !== '' &&
      bookAuthor !== '' &&
      bookLendingDuration !== '' &&
      bookReview !== ''
    ) {
      try {
        setIsLoading(true)

        const { data } = await axios.post('/api/books', {
          bookImage,
          bookTitle,
          bookAuthor,
          bookLendingDuration,
          bookReview,
        })
        if (data === 'OK') {
          toast.success('Kniha pridaná')
          BookModal.onClose()
          router.reload()
        }
      } catch (error) {
        toast.error('Nastala chyba')
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Skontrolujte údaje')
    }
  }, [
    BookModal,
    bookImage,
    bookTitle,
    bookAuthor,
    bookLendingDuration,
    bookReview,
  ])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      {/* <ImageUpload
        value={bookImage}
        disabled={isLoading}
        onChange={(image) => setBookImage(image)}
        label='Nahrajte obrázok knihy'
      /> */}
      <div className='w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700'>
        <h1>Nahrajte obrázok knihy</h1>

        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUploadBookImage}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        ></CldUploadButton>
        <img src={bookImage} height='100' width='100' alt='Uploaded image' />
      </div>
      <Input
        placeholder='Názov'
        onChange={(e) => setBookTitle(e.target.value)}
        value={bookTitle}
        disabled={isLoading}
      />
      {/* <Input
        placeholder='Jazyk knihy (napr. SK, CZ, EN)'
        onChange={(e) => setBookLanguage(e.target.value)}
        value={bookLanguage}
        disabled={isLoading}
      /> */}
      <Input
        placeholder='Autor knihy'
        onChange={(e) => setBookAuthor(e.target.value)}
        value={bookAuthor}
        disabled={isLoading}
      />
      <div
        className='w-full
          flex
          flex-col
          lg:flex-row
          gap-4
          p-4 
          text-lg 
          bg-black 
          border-2
          border-neutral-800 
          rounded-md
          outline-none
          text-[#9ca3af]
          focus:border-sky-500
          focus:border-2
          transition
          disabled:bg-neutral-900
          disabled:opacity-70
          disabled:cursor-not-allowed'
      >
        <h1>Požičiam na</h1>
        <button
          onClick={() => setBookLendingDuration('1')}
          className={
            bookLendingDuration === '1'
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          1 mesiac
        </button>
        <button
          onClick={() => setBookLendingDuration('2')}
          className={
            bookLendingDuration === '2'
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          2 mesiace
        </button>

        <button
          onClick={() => setBookLendingDuration('3')}
          className={
            bookLendingDuration === '3'
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          3 mesiace
        </button>
      </div>

      {/* <div
        className='w-full
          flex
          flex-row
          gap-4
          p-4 
          text-lg 
          bg-black 
          border-2
          border-neutral-800 
          rounded-md
          outline-none
          text-[#9ca3af]
          focus:border-sky-500
          focus:border-2
          transition
          disabled:bg-neutral-900
          disabled:opacity-70
          disabled:cursor-not-allowed'
      >
        <h1>Status</h1>
        <button
          onClick={() => setBookAvailable('voľná')}
          className={
            bookLendingDuration === 'voľná'
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          voľná
        </button>
        <button
          onClick={() => setBookAvailable('požičaná')}
          className={
            bookLendingDuration === 'požičaná'
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          požičaná
        </button>
      </div> */}
      <Input
        placeholder='Krátky popis'
        onChange={(e) => setBookReview(e.target.value)}
        value={bookReview}
        disabled={isLoading}
      />
    </div>
  )

  return (
    <Modal
      //disabled={isLoading}
      isOpen={BookModal.isOpen}
      title='Nahrajte info o Vašej knihe na požičanie'
      actionLabel='Uložiť'
      onClose={BookModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default BookModal
