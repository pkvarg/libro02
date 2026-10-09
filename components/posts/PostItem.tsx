import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { sk } from 'date-fns/locale'
import clsx from 'clsx'
import { HiHeart, HiOutlineChatBubbleOvalLeft, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi2'
import useLoginModal from '@/hooks/useLoginModal'
import useCurrentUser from '@/hooks/useCurrentUser'
import useLike from '@/hooks/useLike'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import Avatar from '../Avatar'
import DeleteAlert from '@/components/alerts/DeleteAlert'
interface PostItemProps {
  data: Record<string, any>
  userId?: string
  // On the post's own page the card is not a link to itself.
  isDetail?: boolean
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, userId, isDetail }) => {
  const router = useRouter()
  const loginModal = useLoginModal()
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const { data: currentUser } = useCurrentUser()
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId })

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

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null
    }

    return formatDistanceToNowStrict(new Date(data.createdAt), { locale: sk, addSuffix: true })
  }, [data.createdAt])

  const whoIsCurrentUser = currentUser?.id
  const whosPost = data?.userId
  const postHref = `/posts/${data.id}`
  const profileHref = `/users/${data.user.id}`

  const handleDelete = async (postId: String, userId: String) => {
    if (postId !== undefined && whosPost === userId) {
      setShowAlert(true)

      try {
        const response = await axios.delete(`/api/posts/${postId}`)
      } catch (error) {
        console.log(error)
      }
    }
    router.push(`/users/${whoIsCurrentUser}`)
    toast.success('Príspevok vymazaný!')
    setShowAlert(false)
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  return (
    <>
      <article className={clsx('card relative p-4 sm:p-5', !isDetail && 'transition-colors hover:border-line-strong')}>
        {!isDetail && (
          <Link
            href={postHref}
            className="focus-ring absolute inset-0 rounded-card"
            aria-label={`Otvoriť príspevok od ${data.user.name}`}
          />
        )}
        <div className="flex items-start gap-3">
          <div className="relative z-10">
            <Avatar userId={data.user.id} src={data.user.profileImage ?? null} name={data.user.name} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
                <Link href={profileHref} className="focus-ring relative z-10 rounded font-semibold text-ink hover:underline">
                  {data.user.name}
                </Link>
                <Link href={profileHref} className="relative z-10 hidden truncate text-sm text-ink-muted hover:underline sm:inline">
                  @{data.user.username}
                </Link>
                <span className="text-sm text-ink-muted">{createdAt}</span>
              </div>
              {whoIsCurrentUser === whosPost && (
                <button
                  type="button"
                  onClick={() => setShowAlert(true)}
                  className="icon-btn relative z-10 -mr-2 -mt-2 h-9 w-9 hover:bg-danger-soft hover:text-danger"
                  aria-label="Vymazať príspevok"
                  title="Vymazať"
                >
                  <HiOutlineTrash size={18} />
                </button>
              )}
            </div>
            <p className={clsx('mt-1 whitespace-pre-line break-words text-ink', isDetail && 'text-lg')}>{data.body}</p>
            <div className="-ml-2 mt-2 flex items-center gap-2">
              <Link
                href={postHref}
                className="focus-ring relative z-10 flex h-9 items-center gap-1.5 rounded-full px-2 text-sm text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
                aria-label={`Komentáre: ${data.comments?.length || 0}`}
              >
                <HiOutlineChatBubbleOvalLeft size={20} />
                {data.comments?.length || 0}
              </Link>
              <button
                type="button"
                onClick={onLike}
                aria-pressed={hasLiked}
                aria-label={hasLiked ? 'Zrušiť páči sa mi' : 'Páči sa mi'}
                className={clsx(
                  'focus-ring relative z-10 flex h-9 items-center gap-1.5 rounded-full px-2 text-sm transition-colors hover:bg-brand-soft',
                  hasLiked ? 'text-brand' : 'text-ink-muted hover:text-brand'
                )}
              >
                {hasLiked ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                {data.likedIds.length}
              </button>
            </div>
          </div>
        </div>
      </article>

      {showAlert && (
        <DeleteAlert
          onDelete={() => handleDelete(data.id, data.user.id)}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default PostItem
