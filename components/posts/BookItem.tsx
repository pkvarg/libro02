import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiOutlineChatBubbleLeftRight, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import useCurrentUser from '@/hooks/useCurrentUser'
import useLoginModal from '@/hooks/useLoginModal'
import useStartConversation from '@/hooks/useStartConversation'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import DeleteAlert from '@/components/alerts/DeleteAlert'
import Avatar from '@/components/Avatar'
import BookCover from '@/components/books/BookCover'
import BookMeta from '@/components/books/BookMeta'
interface BookItemProps {
  data: Record<string, any>
  userId?: string
}

const BookItem: React.FC<BookItemProps> = ({ data = {} }) => {
  const router = useRouter()
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const { data: currentUser } = useCurrentUser()
  const loginModal = useLoginModal()
  const { startConversation, isLoading } = useStartConversation()

  const whoIsCurrentUser = currentUser?.id
  const whosBook = data?.userId
  const isOwner = !!whoIsCurrentUser && whoIsCurrentUser === whosBook
  const bookHref = `/books/${data.id}`

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
    setShowAlert(false)
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  return (
    <>
      <article className="card relative flex gap-4 p-4 transition-colors hover:border-line-strong sm:gap-5 sm:p-5">
        {currentUser ? (
          <Link href={bookHref} className="focus-ring absolute inset-0 z-[1] rounded-card" aria-label={`Detail knihy ${data.bookTitle}`} />
        ) : (
          // Logged-out visitors see the catalogue; any click leads to login (and from there to registration).
          <button
            type="button"
            onClick={loginModal.onOpen}
            className="focus-ring absolute inset-0 z-[1] rounded-card"
            aria-label={`Prihláste sa a zobrazte detail knihy ${data.bookTitle}`}
          />
        )}
        <BookCover src={data.bookImage} title={data.bookTitle} className="w-24 sm:w-28" />

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl">{data.bookTitle}</h3>
          <p className="text-sm text-ink-muted">{data.bookAuthor}</p>
          <div className="mt-2">
            <BookMeta available={data.bookAvailable} lendingDuration={data.bookLendingDuration} />
          </div>
          {data.bookReview && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{data.bookReview}</p>}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            {data.user && (
              <div className="relative z-10 mr-auto flex min-w-0 items-center gap-2">
                <Avatar userId={data.user.id} src={data.user.profileImage ?? null} name={data.user.name} size="xs" />
                <Link href={`/users/${data.user.id}`} className="focus-ring truncate rounded text-sm text-ink-soft hover:text-ink hover:underline">
                  {data.user.name}
                </Link>
              </div>
            )}
            {!isOwner && (
              <button
                type="button"
                onClick={() => startConversation(data.userId)}
                disabled={isLoading}
                className="btn btn-primary btn-sm relative z-10 ml-auto"
              >
                <HiOutlineChatBubbleLeftRight size={16} />
                Kontakt
              </button>
            )}
            {isOwner && (
              <div className="relative z-10 ml-auto flex items-center gap-1">
                <Link href={`${bookHref}?edit=1`} className="btn btn-secondary btn-sm">
                  <HiOutlinePencilSquare size={16} />
                  Upraviť
                </Link>
                <button
                  type="button"
                  onClick={() => setShowAlert(true)}
                  className="icon-btn h-9 w-9 hover:bg-danger-soft hover:text-danger"
                  aria-label="Vymazať knihu"
                  title="Vymazať"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {showAlert && (
        <DeleteAlert title="Naozaj chcete vymazať knihu?" onDelete={() => handleDelete(data.id)} onCancel={handleCancel} />
      )}
    </>
  )
}

export default BookItem
