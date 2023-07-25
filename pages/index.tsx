import Header from '@/components/Header'
import Form from '@/components/Form'
import PostFeed from '@/components/posts/PostFeed'
import BookFeed from '@/components/posts/BookFeed'
export default function Home() {
  return (
    <>
      <Header label='Domov' />
      <Form placeholder='Zdieľaj niečo' />
      {/* <PostFeed /> */}
      <BookFeed />
    </>
  )
}
