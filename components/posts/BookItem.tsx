import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai'
import { formatDistanceToNowStrict } from 'date-fns'
import { BsTrash } from 'react-icons/bs'
import useLoginModal from '@/hooks/useLoginModal'
import useCurrentUser from '@/hooks/useCurrentUser'
import useLike from '@/hooks/useLike'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import Avatar from '../Avatar'
import DeleteAlert from '@/components/alerts/DeleteAlert'
interface BookItemProps {
  data: Record<string, any>
  userId?: string
}

const BookItem: React.FC<BookItemProps> = ({ data = {}, userId }) => {
  const router = useRouter()
  const loginModal = useLoginModal()
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const { data: currentUser } = useCurrentUser()
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId })

  console.log(data)

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation()
      router.push(`/users/${data.userId}`)
    },
    [router, data.userId]
  )

  const goToBook = useCallback(() => {
    router.push(`/books/${data.id}`)
  }, [router, data.id])

  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation()

      if (!currentUser) {
        return loginModal.onOpen()
      }

      toggleLike()
    },
    [loginModal, currentUser, toggleLike]
  )

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null
    }

    return formatDistanceToNowStrict(new Date(data.createdAt))
  }, [data.createdAt])

  const whoIsCurrentUser = currentUser?.id
  const whosBook = data?.userId

  const handleDelete = async (bookId: String, userId: String) => {
    if (bookId !== undefined && whosBook === userId) {
      setShowAlert(true)

      try {
        const response = await axios.delete(`/api/books/${bookId}`)
      } catch (error) {
        console.log(error)
      }
    }
    //router.reload()
    // setTimeout(() => {
    // }, 2000)
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
        onClick={goToBook}
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
            src={data.bookImage}
            alt={data.bookTitle}
          />

          <div
            className='flex flex-col gap-2 text-white
                '
          >
            <p
              onClick={goToUser}
              className='
                text-[35px]
                
                
            '
            >
              {data.bookTitle}
            </p>
            <p
              className='
                text-[30px]
            '
            >
              {data.bookAuthor}
            </p>
            <p className='text-[25px]'>
              Dostupná :{' '}
              <span
                className={
                  data.bookAvailable ? 'text-[#4bb543]' : 'text-[#ff781f]'
                }
              >
                {data.bookAvailable ? 'áno' : 'požičaná'}
              </span>{' '}
            </p>
            <p className='text-[25px]'>Popis : {data.bookReview}</p>
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
              onClick={onLike}
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

export default BookItem
