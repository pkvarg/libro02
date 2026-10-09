import Header from '@/components/Header'
import Form from '@/components/Form'
import BookFeed from '@/components/posts/BookFeed'
import useCurrentUser from '@/hooks/useCurrentUser'

export default function Home() {
  const { data: currentUser } = useCurrentUser()

  return (
    <>
      <Header label="Domov" />
      <Form placeholder="Zdieľaj niečo" />
      <h2 className="mb-3 mt-6 font-display text-lg font-semibold text-ink">Knihy na požičanie</h2>
      {!currentUser && (
        <p className="-mt-2 mb-3 text-sm text-ink-muted">
          Prihláste sa alebo si vytvorte účet, aby ste videli detail knihy a mohli si ju požičať.
        </p>
      )}
      <BookFeed />
    </>
  )
}
