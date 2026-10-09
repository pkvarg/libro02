import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import useEditBookModal from '@/hooks/useEditBookModal'
import Input from '../Input'
import Modal from '../Modal'
import ImagePicker from '../ImagePicker'
import ChoiceGroup from '../ChoiceGroup'

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
      <ImagePicker
        label='Obrázok knihy'
        shape='book'
        value={bookImage}
        onUpload={handleUploadBookImage}
      />
      <Input
        label='Názov'
        placeholder='Názov'
        onChange={(e) => setBookTitle(e.target.value)}
        value={bookTitle}
        disabled={isLoading}
      />

      <Input
        label='Autor knihy'
        placeholder='Autor knihy'
        onChange={(e) => setBookAuthor(e.target.value)}
        value={bookAuthor}
        disabled={isLoading}
      />
      <ChoiceGroup<string>
        label='Požičiam na'
        value={bookLendingDuration}
        onChange={setBookLendingDuration}
        options={[
          { value: '1', label: '1 mesiac' },
          { value: '2', label: '2 mesiace' },
          { value: '3', label: '3 mesiace' },
        ]}
      />
      <ChoiceGroup<boolean>
        label='Status'
        value={bookAvailable}
        onChange={setBookAvailable}
        options={[
          { value: true, label: 'voľná' },
          { value: false, label: 'požičaná' },
        ]}
      />
      <Input
        label='Krátky popis'
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
