import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'
import { sk } from 'date-fns/locale'
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

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null
    }

    return formatDistanceToNowStrict(new Date(data.createdAt), { locale: sk, addSuffix: true })
  }, [data.createdAt])

  const whoIsCurrentUser = currentUser?.id
  const whosComment = data?.userId

  const handleDelete = async (commentId: String) => {
    try {
      await axios.delete(`/api/comments/${commentId}`)
      toast.success('Komentár vymazaný')
      router.reload()
    } catch (error) {
      toast.error('Komentár sa nepodarilo vymazať')
    } finally {
      setShowAlert(false)
    }
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  // Same rule as the server: the comment's author or an admin.
  const mayDelete = !!whoIsCurrentUser && (whoIsCurrentUser === whosComment || !!currentUser?.isAdmin)

  return (
    <div className="flex items-start gap-3 px-4 py-3 sm:px-5">
      <Avatar userId={data.user.id} src={data.user.profileImage ?? null} name={data.user.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
            <Link href={`/users/${data.user.id}`} className="focus-ring rounded font-semibold text-ink hover:underline">
              {data.user.name}
            </Link>
            <Link
              href={`/users/${data.user.id}`}
              className="hidden truncate text-sm text-ink-muted hover:underline sm:inline"
            >
              @{data.user.username}
            </Link>
            <span className="text-sm text-ink-muted">{createdAt}</span>
          </div>
          {mayDelete && (
            <button
              type="button"
              onClick={() => setShowAlert(true)}
              className="icon-btn -mr-2 -mt-1.5 h-9 w-9 hover:bg-danger-soft hover:text-danger"
              aria-label="Vymazať komentár"
              title="Vymazať"
            >
              <BsTrash size={15} />
            </button>
          )}
        </div>
        <p className="mt-0.5 whitespace-pre-line break-words text-ink">{data.body}</p>
      </div>
      {showAlert && (
        <DeleteAlert
          title="Naozaj chcete vymazať komentár?"
          onDelete={() => handleDelete(data.id)}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default CommentItem
