import axios from 'axios'
import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'

import useLoginModal from '@/hooks/useLoginModal'
import useRegisterModal from '@/hooks/useRegisterModal'
import useCurrentUser from '@/hooks/useCurrentUser'
import usePosts from '@/hooks/usePosts'
import usePost from '@/hooks/usePost'

import Avatar from './Avatar'
import Button from './Button'

interface FormProps {
  placeholder: string
  isComment?: boolean
  postId?: string
}

const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()

  const { data: currentUser } = useCurrentUser()
  const { mutate: mutatePosts } = usePosts()
  const { mutate: mutatePost } = usePost(postId as string)

  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)

      const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts'

      await axios.post(url, { body })

      toast.success('Príspevok vytvorený')
      setBody('')
      mutatePosts()
      mutatePost()
    } catch (error) {
      toast.error('Nastala chyba')
    } finally {
      setIsLoading(false)
    }
  }, [body, mutatePosts, isComment, postId, mutatePost])

  return (
    <div className={isComment ? 'card mt-3 p-4 sm:p-5' : 'card mb-4 p-4 sm:p-5'}>
      {currentUser ? (
        <div className="flex flex-row gap-3">
          <Avatar userId={currentUser?.id} src={currentUser?.profileImage ?? null} name={currentUser?.name} />
          <div className="min-w-0 flex-1">
            <textarea
              disabled={isLoading}
              onChange={(event) => setBody(event.target.value)}
              value={body}
              rows={isComment ? 2 : 3}
              aria-label={placeholder}
              className="
                block
                w-full
                resize-none
                rounded-xl
                border
                border-transparent
                bg-sunken
                px-3
                py-2.5
                text-base
                text-ink
                placeholder:text-ink-faint
                transition
                focus:border-brand
                focus:bg-surface
                focus:outline-none
                focus:ring-2
                focus:ring-brand-soft
                disabled:opacity-70
              "
              placeholder={placeholder}
            ></textarea>
            <div className="mt-3 flex flex-row justify-end">
              <Button
                disabled={isLoading || !body.trim()}
                onClick={onSubmit}
                label={isComment ? 'Odpovedať' : 'Zdieľať'}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-2 py-6 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Vitaj na Librosophii</h1>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            Súkromný portál na vzájomné požičiavanie kresťanských kníh. Prihláste sa alebo si vytvorte účet.
          </p>
          <div className="mt-6 flex flex-row items-center justify-center gap-3">
            <Button label="Prihlásenie" onClick={loginModal.onOpen} large />
            <Button label="Registrácia" onClick={registerModal.onOpen} secondary large />
          </div>
        </div>
      )}
    </div>
  )
}

export default Form
