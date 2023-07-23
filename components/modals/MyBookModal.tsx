import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import useCurrentUser from '@/hooks/useCurrentUser'
import useMyBookModal from '@/hooks/useMyBookModal'
import useUser from '@/hooks/useUser'

import Input from '../Input'
import Modal from '../Modal'
import ImageUpload from '../ImageUpload'

const MyBookModal = () => {
  const { data: currentUser } = useCurrentUser()
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id)
  const myBookModal = useMyBookModal()

  const [bookOwnerEmail, setBookOwnerEmail] = useState('')
  const [bookImage, setBookImage] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookLanguage, setBookLanguage] = useState('')
  const [bookAuthor, setBookAuthor] = useState('')
  const [bookLendingDuration, setBookLendingDuration] = useState('')
  const [bookAvailable, setBookAvailable] = useState('')
  const [bookReview, setBookReview] = useState('')

  useEffect(() => {
    setBookOwnerEmail(currentUser?.email)
  }, [currentUser?.email])

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)

      await axios.patch('/api/createMyBook', {
        bookOwnerEmail,
        bookImage,
        bookTitle,
        bookLanguage,
        bookAuthor,
        bookLendingDuration,
        bookAvailable,
        bookReview,
      })
      //mutateFetchedUser()

      toast.success('Kniha pridaná')

      myBookModal.onClose()
    } catch (error) {
      toast.error('Nastala chyba')
    } finally {
      setIsLoading(false)
    }
  }, [
    myBookModal,
    bookOwnerEmail,
    bookImage,
    bookTitle,
    bookLanguage,
    bookAuthor,
    bookLendingDuration,
    bookAvailable,
    bookReview,
    //mutateFetchedUser,
  ])

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <ImageUpload
        value={bookImage}
        disabled={isLoading}
        onChange={(image) => setBookImage(image)}
        label='Najhrajte obrázok knihy'
      />
      <Input
        placeholder='Názov'
        onChange={(e) => setBookTitle(e.target.value)}
        value={bookTitle}
        disabled={isLoading}
      />
      <Input
        placeholder='Jazyk knihy'
        onChange={(e) => setBookLanguage(e.target.value)}
        value={bookLanguage}
        disabled={isLoading}
      />
      <Input
        placeholder='Autor knihy'
        onChange={(e) => setBookAuthor(e.target.value)}
        value={bookAuthor}
        disabled={isLoading}
      />
      <Input
        placeholder='Požičiam na ? mesiacov'
        onChange={(e) => setBookLendingDuration(e.target.value)}
        value={bookLendingDuration}
        disabled={isLoading}
      />{' '}
      <Input
        placeholder='Status (voľná/požičaná)'
        onChange={(e) => setBookAvailable(e.target.value)}
        value={bookAvailable}
        disabled={isLoading}
      />{' '}
      <Input
        placeholder='Recenzia (krátky popis príp. recenzia)'
        onChange={(e) => setBookReview(e.target.value)}
        value={bookReview}
        disabled={isLoading}
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={myBookModal.isOpen}
      title='Nahrajte info o Vašej knihe na požičanie'
      actionLabel='Uložiť'
      onClose={myBookModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  )
}

export default MyBookModal
