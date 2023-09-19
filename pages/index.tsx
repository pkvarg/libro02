import Header from '@/components/Header'
import Form from '@/components/Form'
import PostFeed from '@/components/posts/PostFeed'
import BookFeed from '@/components/posts/BookFeed'
import { useSocket } from '@/components/providers/SocketProvider'
import { useEffect } from 'react'
export default function Home() {
  const { isConnected } = useSocket()
  useEffect(() => {
    console.log('isCon', isConnected)
  }, [isConnected])

  return (
    <>
      <Header label='Domov' />
      <Form placeholder='Zdieľaj niečo' />
      {/* <PostFeed /> */}
      <BookFeed />
    </>
  )
}
