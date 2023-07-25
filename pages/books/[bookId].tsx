import { useState } from 'react'
import { useRouter } from 'next/router'
import { ClipLoader } from 'react-spinners'
import useCurrentUser from '@/hooks/useCurrentUser'
import { BsTrash } from 'react-icons/bs'

import useBook from '@/hooks/useBook'

import Header from '@/components/Header'
import Form from '@/components/Form'
import BookItem from '@/components/posts/BookItem'
import CommentFeed from '@/components/posts/CommentFeed'

const BookView = () => {
  const router = useRouter()
  const { bookId } = router.query
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

  return (
    <>
      {/* <Header showBackArrow label='Zdieľaj' />
      <BookItem data={fetchedPost} /> */}
      {/* <Form bookId={bookId as string} isComment placeholder='Zdieľaj odpoveď' /> */}
      {/* <CommentFeed comments={fetchedPost?.comments} /> */}

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
        <div className='flex flex-col items-start gap-3'>
          <img
            className='w-full h-full'
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
          {/* <div className='text-white mt-1'>{data.body}</div> */}
          <div className='flex flex-row items-center mt-3 gap-10'>
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
            >
              {/* <AiOutlineMessage size={20} />
                <p>{data.comments?.length || 0}</p> */}
            </div>
            <div
              //onClick={onLike}
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
            >
              {/* <LikeIcon color={hasLiked ? 'red' : ''} size={20} /> */}
              {/* <p>{data.likedIds.length}</p> */}
            </div>
          </div>
        </div>
      </div>
      {whoIsCurrentUser === whosBook && (
        <div className='relative'>
          <button
            onClick={() => setShowAlert(true)}
            className='ml-auto cursor-pointer text-[#ff0000] absolute -top-36 right-1 lg:right-4'
          >
            <BsTrash />
          </button>
        </div>
      )}

      {showAlert && (
        <DeleteAlert
          onDelete={() => handleDelete(data.id, data.user.id)}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default BookView
