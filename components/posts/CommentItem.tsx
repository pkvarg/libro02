import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import useCurrentUser from '@/hooks/useCurrentUser'
import Avatar from '../Avatar'
import DeleteAlert from '@/components/alerts/DeleteAlert'
import axios from 'axios'
import { BsTrash } from 'react-icons/bs'
import { toast } from 'react-hot-toast'

interface CommentItemProps {
  data: Record<string, any>
}

const CommentItem: React.FC<CommentItemProps> = ({ data = {} }) => {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [whosPost, setWhosPost] = useState<string>('')

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation()

      router.push(`/users/${data.user.id}`)
    },
    [router, data.user.id]
  )

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null
    }

    return formatDistanceToNowStrict(new Date(data.createdAt))
  }, [data.createdAt])

  const whoIsCurrentUser = currentUser?.id
  const whosComment = data?.userId
  const postIsCommented = router.query?.postId

  useEffect(() => {
    if (postIsCommented !== undefined) {
      try {
        const checkWhosPostIsCommented = async () => {
          const { data } = await axios.get(`/api/posts/${postIsCommented}`)
          setWhosPost(data?.userId)
        }
        checkWhosPostIsCommented()
      } catch (error) {
        console.log(error)
      }
    }
  }, [postIsCommented])

  const handleDelete = async (commentId: String, userId: String) => {
    if (commentId !== undefined && whosComment === userId) {
      setShowAlert(true)

      try {
        const response = await axios.delete(`/api/comments/${commentId}`)
      } catch (error) {
        console.log(error)
      }
    }
    toast.success('Príspevok vymazaný!')

    router.reload()
    setShowAlert(false)
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  return (
    <div
      className='
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
      '
    >
      <div className='flex flex-row items-start gap-3'>
        <Avatar userId={data.user.id} />
        <div>
          <div className='flex flex-row items-center gap-2'>
            <p
              onClick={goToUser}
              className='
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            '
            >
              {data.user.name}
            </p>
            <span
              onClick={goToUser}
              className='
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            '
            >
              @{data.user.username}
            </span>
            <span className='text-neutral-500 text-sm'>{createdAt}</span>
          </div>
          <div className='text-white mt-1'>{data.body}</div>
        </div>
      </div>
      {whoIsCurrentUser === whosComment && (
        <div className='relative'>
          <button
            onClick={() => setShowAlert(true)}
            className='ml-auto cursor-pointer text-[#ff0000] absolute -top-12 -right-4 lg:right-0'
          >
            <BsTrash />
          </button>
        </div>
      )}
      {whoIsCurrentUser === whosPost && (
        <div className='relative'>
          <button
            onClick={() => setShowAlert(true)}
            className='ml-auto cursor-pointer text-[#ff0000] absolute -top-12 -right-4 lg:right-0'
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
    </div>
  )
}

export default CommentItem
