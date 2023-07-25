import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ClipLoader } from 'react-spinners'
import useCurrentUser from '@/hooks/useCurrentUser'
import { BsTrash } from 'react-icons/bs'
import DeleteAlert from '@/components/alerts/DeleteAlert'
import useBook from '@/hooks/useBook'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import useEditBookModal from '@/hooks/useEditBookModal'

import Header from '@/components/Header'
import Form from '@/components/Form'
import BookItem from '@/components/posts/BookItem'
import CommentFeed from '@/components/posts/CommentFeed'

const BookView = () => {
  const router = useRouter()
  const { bookId } = router.query
  const editBookModal = useEditBookModal()

  useEffect(() => {
    if (bookId) {
      editBookModal.onOpen()
    }
  }, [bookId])

  const { data: currentUser } = useCurrentUser()
  const whoIsCurrentUser = currentUser?.id
  const { data: fetchedPost, isLoading } = useBook(bookId as string)
  const whosBook = fetchedPost?.userId

  const [showAlert, setShowAlert] = useState<boolean>(false)

  if (isLoading || !fetchedPost) {
    return (
      <div className='flex justify-center items-center h-full'>
        <ClipLoader color='lightblue' size={80} />
      </div>
    )
  }

  const handleDelete = async (bookId: String) => {
    if (bookId !== undefined) {
      setShowAlert(true)

      try {
        const response = await axios.delete(`/api/books/${bookId}`)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    router.push(`/users/${whoIsCurrentUser}`)
    toast.success('Kniha vymazaná!')
    //router.reload()
    setShowAlert(false)
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  return (
    <>
      <div
        className='
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
        relative
      '
      >
        <div className='flex flex-col lg:flex-row gap-3 relative'>
          <img
            className='lg:w-[50%] lg:h-[50%]'
            src={fetchedPost.bookImage}
            alt={fetchedPost.bookTitle}
          />

          <div
            className='flex flex-col gap-2 text-white
                '
          >
            <p
              className='
                text-[35px]
            '
            >
              {fetchedPost.bookTitle}
            </p>
            <p
              className='
                text-[30px]
            '
            >
              {fetchedPost.bookAuthor}
            </p>
            <p className='text-[25px]'>
              Dostupná :{' '}
              <span
                className={
                  fetchedPost.bookAvailable
                    ? 'text-[#4bb543]'
                    : 'text-[#ff781f]'
                }
              >
                {fetchedPost.bookAvailable ? 'áno' : 'požičaná'}
              </span>{' '}
            </p>
            <p className='text-[25px]'>Popis : {fetchedPost.bookReview}</p>
          </div>
          {/* <div className='flex flex-row items-center mt-3 gap-10'>
            <div
              className='
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-sky-500
            '
            ></div>
            <div
              className='
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            '
            ></div>
          </div> */}
        </div>
      </div>
      {whoIsCurrentUser === whosBook && (
        <div className='relative my-4 lg:-mt-2'>
          <button
            onClick={() => setShowAlert(true)}
            className='cursor-pointer text-[#ff0000] absolute bottom-4 right-2 lg:right-1'
          >
            <BsTrash />
          </button>
          <button
            onClick={editBookModal.onOpen}
            className='border rounded-xl px-2 cursor-pointer absolute bottom-3 right-10'
          >
            Upraviť
          </button>
        </div>
      )}

      {showAlert && (
        <DeleteAlert
          onDelete={() => handleDelete(fetchedPost.id)}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default BookView
