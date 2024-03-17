import Header from '@/components/Header'
import Form from '@/components/Form'
import PostFeed from '@/components/posts/PostFeed'
export default function Home() {
  return (
    <>
      <Header label='Domov' />
      <Form placeholder='Zdieľaj niečo' />
      <PostFeed />
    </>
  )
}
