import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import useBookModal from '@/hooks/useBookModal'
import Input from '../Input'
import Modal from '../Modal'
import ImagePicker from '../ImagePicker'
import ChoiceGroup from '../ChoiceGroup'

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
      {/* <Input
        placeholder='Jazyk knihy (napr. SK, CZ, EN)'
        onChange={(e) => setBookLanguage(e.target.value)}
        value={bookLanguage}
        disabled={isLoading}
      /> */}
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
      isOpen={BookModal.isOpen}
      title='Pridať knihu na požičanie'
      actionLabel='Uložiť'
      onClose={BookModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default BookModal
