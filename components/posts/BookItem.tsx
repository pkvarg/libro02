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

  const handleDelete = async (bookId: String) => {
    console.log('bid:', bookId)
    if (bookId !== undefined) {
      setShowAlert(true)

      try {
        const response = await axios.delete(`/api/books/${bookId}`)
        console.log(response)
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
        //onClick={goToBook}
        className='
        border-b-[1px] 
        border-neutral-800 
        p-5 
        
        hover:bg-neutral-900 
        transition
        
      '
      >
        <div className='flex flex-col lg:flex-row gap-3 relative'>
          <img
            className='lg:w-[50%] lg:h-[50%]'
            src={data.bookImage}
            alt={data.bookTitle}
          />

          <div
            className='flex flex-col text-white
                '
          >
            <p
              className='
                text-[25px]
            '
            >
              {data.bookTitle}
            </p>
            <p
              className='
                text-[22.5px]
            '
            >
              {data.bookAuthor}
            </p>
            <p className='text-[22.5px]'>
              <span
                className={
                  data.bookAvailable ? 'text-[#4bb543]' : 'text-[#ff781f]'
                }
              >
                {data.bookAvailable ? 'Dostupná' : 'Požičaná'}
              </span>{' '}
            </p>
            <p className='text-[20px]'>
              Výpožičná doba: {data.bookLendingDuration}{' '}
              {data.bookLendingDuration !== '1' ? 'mesiace' : 'mesiac'}
            </p>
            <p className='text-[20px] mb-8 lg:mb-0'>
              Popis : {data.bookReview}
            </p>
          </div>
          {/* <div className='text-white mt-1'>{data.body}</div> */}
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
            >
              <AiOutlineMessage size={20} />
                <p>{data.comments?.length || 0}</p>
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
              <LikeIcon color={hasLiked ? 'red' : ''} size={20} /> 
               <p>{data.likedIds.length}</p>
               </div>
              </div> */}

          {whoIsCurrentUser === whosBook && (
            <div>
              <button
                onClick={() => setShowAlert(true)}
                className='cursor-pointer text-[#ff0000] absolute bottom-3 -right-1 lg:-right-1'
              >
                <BsTrash />
              </button>
              <button
                onClick={goToBook}
                className='border rounded-xl px-2 cursor-pointer absolute bottom-2 right-8'
              >
                Upraviť
              </button>
            </div>
          )}

          {showAlert && (
            <DeleteAlert
              onDelete={() => handleDelete(data.id)}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default BookItem
