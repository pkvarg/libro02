import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ClipLoader } from 'react-spinners'
import { HiOutlineChatBubbleLeftRight, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import useCurrentUser from '@/hooks/useCurrentUser'
import DeleteAlert from '@/components/alerts/DeleteAlert'
import useBook from '@/hooks/useBook'
import useUser from '@/hooks/useUser'
import useStartConversation from '@/hooks/useStartConversation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import useEditBookModal from '@/hooks/useEditBookModal'
import useLoginModal from '@/hooks/useLoginModal'
import useRegisterModal from '@/hooks/useRegisterModal'

import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import BookCover from '@/components/books/BookCover'
import BookMeta from '@/components/books/BookMeta'

const BookView = () => {
  const router = useRouter()
  const { bookId, edit } = router.query
  const editBookModal = useEditBookModal()
  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()
  const { startConversation, isLoading: isStarting } = useStartConversation()

  const { data: currentUser } = useCurrentUser()
  const whoIsCurrentUser = currentUser?.id
  const { data: fetchedPost, isLoading, error } = useBook(bookId as string)
  const whosBook = fetchedPost?.userId
  const { data: owner } = useUser(whosBook)
  const isOwner = !!whoIsCurrentUser && whoIsCurrentUser === whosBook

  // "Upraviť" on a book card links here with ?edit=1 and opens the editor for the owner.
  useEffect(() => {
    if (bookId && edit && isOwner) {
      editBookModal.onOpen()
    }
  }, [bookId, edit, isOwner])

  const [showAlert, setShowAlert] = useState<boolean>(false)

  if (error) {
    return (
      <>
        <Header showBackArrow label='Kniha' />
        {error?.response?.status === 401 ? (
          <div className='card flex flex-col items-center gap-4 p-8 text-center'>
            <p className='text-ink-soft'>Detail knihy vidia len prihlásení členovia.</p>
            <div className='flex gap-3'>
              <button type='button' onClick={loginModal.onOpen} className='btn btn-primary'>
                Prihlásenie
              </button>
              <button type='button' onClick={registerModal.onOpen} className='btn btn-secondary'>
                Registrácia
              </button>
            </div>
          </div>
        ) : (
          <p className='card p-6 text-center text-ink-muted'>Kniha neexistuje alebo bola skrytá.</p>
        )}
      </>
    )
  }

  if (isLoading || !fetchedPost) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <ClipLoader color='#7C2D3A' size={40} />
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
    setShowAlert(false)
  }

  const handleCancel = () => {
    setShowAlert(false)
  }

  return (
    <>
      <Header showBackArrow label='Kniha' />
      <article className='card p-5 sm:p-6'>
        <div className='flex flex-col gap-6 sm:flex-row'>
          <BookCover
            src={fetchedPost.bookImage}
            title={fetchedPost.bookTitle}
            className='mx-auto w-44 sm:mx-0 sm:w-52'
          />
          <div className='flex min-w-0 flex-1 flex-col gap-3'>
            <div>
              <h2 className='font-display text-3xl font-semibold leading-tight text-ink'>
                {fetchedPost.bookTitle}
              </h2>
              <p className='mt-1 text-lg text-ink-soft'>{fetchedPost.bookAuthor}</p>
            </div>
            <BookMeta
              large
              available={fetchedPost.bookAvailable}
              lendingDuration={fetchedPost.bookLendingDuration}
            />
            {fetchedPost.bookReview && (
              <div className='mt-1'>
                <h3 className='text-sm font-semibold uppercase tracking-wide text-ink-muted'>Popis</h3>
                <p className='mt-1 whitespace-pre-line text-ink'>{fetchedPost.bookReview}</p>
              </div>
            )}
          </div>
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5'>
          {owner && (
            <div className='mr-auto flex min-w-0 items-center gap-3'>
              <Avatar userId={owner.id} src={owner.profileImage ?? null} name={owner.name} />
              <div className='min-w-0'>
                <p className='text-xs text-ink-muted'>Knihu požičiava</p>
                <Link
                  href={`/users/${owner.id}`}
                  className='focus-ring block truncate rounded font-semibold text-ink hover:underline'
                >
                  {owner.name}
                </Link>
              </div>
            </div>
          )}
          {!isOwner && (
            <button
              type='button'
              onClick={() => startConversation(fetchedPost.userId)}
              disabled={isStarting}
              className='btn btn-primary ml-auto'
            >
              <HiOutlineChatBubbleLeftRight size={18} />
              Kontakt
            </button>
          )}
          {isOwner && (
            <div className='ml-auto flex items-center gap-2'>
              <button type='button' onClick={editBookModal.onOpen} className='btn btn-secondary'>
                <HiOutlinePencilSquare size={18} />
                Upraviť
              </button>
              <button
                type='button'
                onClick={() => setShowAlert(true)}
                className='btn btn-ghost text-danger hover:bg-danger-soft hover:text-danger'
              >
                <HiOutlineTrash size={18} />
                Vymazať
              </button>
            </div>
          )}
        </div>
      </article>

      {showAlert && (
        <DeleteAlert
          title='Naozaj chcete vymazať knihu?'
          onDelete={() => handleDelete(fetchedPost.id)}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default BookView
