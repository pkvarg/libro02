import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import useEditBookModal from '@/hooks/useEditBookModal'
import Input from '../Input'
import Modal from '../Modal'
import ImageUpload from '../ImageUpload'
import { CldUploadButton } from 'next-cloudinary'

import { useRouter } from 'next/router'
import useCurrentUser from '@/hooks/useCurrentUser'

const EditBookModal = () => {
  const router = useRouter()
  const bookId = router.query?.bookId
  const editBookModal = useEditBookModal()
  const { data: currentUser } = useCurrentUser()

  const currentUserId = currentUser?.id

  // const goToUser = useCallback(
  //   (ev: any) => {
  //     ev.stopPropagation()
  //     router.push(`/users/${currentUserId}`)
  //   },
  //   [router, currentUserId]
  // )

  const [bookImage, setBookImage] = useState<string>('')
  const [bookTitle, setBookTitle] = useState<string>('')
  const [bookAuthor, setBookAuthor] = useState<string>('')
  const [bookLendingDuration, setBookLendingDuration] = useState<string>('')
  const [bookReview, setBookReview] = useState<string>('')
  const [bookAvailable, setBookAvailable] = useState<boolean>()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (bookId !== undefined) {
      const getBookToEdit = async () => {
        try {
          const book = await axios.get(`/api/books/${bookId}`)
          setBookImage(book?.data?.bookImage)
          setBookTitle(book?.data?.bookTitle)
          setBookAuthor(book?.data?.bookAuthor)
          setBookLendingDuration(book?.data?.bookLendingDuration)
          setBookAvailable(book?.data?.bookAvailable)
          setBookReview(book?.data?.bookReview)
        } catch (error) {
          console.log(error)
        }
      }
      getBookToEdit()
    }
  }, [bookId])

  const handleUploadBookImage = (result: any) => {
    setBookImage(result.info.secure_url)
  }

  const onSubmit = useCallback(async () => {
    if (
      (bookId !== undefined && bookTitle !== '') ||
      bookAuthor !== '' ||
      bookLendingDuration !== '' ||
      bookReview !== ''
    ) {
      try {
        setIsLoading(true)

        const { data } = await axios.patch(`/api/books/${bookId}`, {
          bookImage,
          bookTitle,
          bookAuthor,
          bookLendingDuration,
          bookAvailable,
          bookReview,
        })
        console.log('book:', data)
        if (data === 'OK') {
          toast.success('Kniha upravená')
          editBookModal.onClose()
          router.push(`/users/${currentUserId}`)
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
    EditBookModal,
    bookImage,
    bookTitle,
    bookAuthor,
    bookLendingDuration,
    bookAvailable,
    bookReview,
  ])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      {/* <ImageUpload
        value={bookImage}
        disabled={isLoading}
        onChange={(image) => setBookImage(image)}
        label='Najhrajte obrázok knihy'
      /> */}
      <div className='w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700'>
        <h1>Nahrajte obrázok knihy</h1>

        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUploadBookImage}
          uploadPreset='ug3mdafi'
        ></CldUploadButton>
        <img src={bookImage} height='100' width='100' alt='Uploaded image' />
      </div>
      <Input
        placeholder='Názov'
        onChange={(e) => setBookTitle(e.target.value)}
        value={bookTitle}
        disabled={isLoading}
      />

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

      <div
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
          onClick={() => setBookAvailable(true)}
          className={
            bookAvailable === true
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          voľná
        </button>
        <button
          onClick={() => setBookAvailable(false)}
          className={
            bookAvailable === false
              ? 'bg-[#ff781f] border border-[#9ca3af] rounded-xl px-2 text-white'
              : 'border border-[#9ca3af] rounded-xl px-2 '
          }
        >
          požičaná
        </button>
      </div>
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
      isOpen={editBookModal.isOpen}
      title='Upravte info o Vašej knihe'
      actionLabel='Uložiť'
      onClose={editBookModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default EditBookModal
