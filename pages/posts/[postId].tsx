import { useRouter } from 'next/router'
import { ClipLoader } from 'react-spinners'

import usePost from '@/hooks/usePost'

import Header from '@/components/Header'
import Form from '@/components/Form'
import PostItem from '@/components/posts/PostItem'
import CommentFeed from '@/components/posts/CommentFeed'

const PostView = () => {
  const router = useRouter()
  const { postId } = router.query

  const { data: fetchedPost, isLoading, error } = usePost(postId as string)

  if (error) {
    return (
      <>
        <Header showBackArrow label='Príspevok' />
        <p className='card p-6 text-center text-ink-muted'>Príspevok neexistuje alebo bol skrytý.</p>
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

  return (
    <>
      <Header showBackArrow label='Príspevok' />
      <PostItem data={fetchedPost} isDetail />
      <Form postId={postId as string} isComment placeholder='Zdieľaj odpoveď' />
      <CommentFeed comments={fetchedPost?.comments} />
    </>
  )
}

export default PostView
