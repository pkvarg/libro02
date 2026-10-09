import usePosts from '@/hooks/usePosts'

import PostItem from './PostItem'

interface PostFeedProps {
  userId?: string
}

const PostFeed: React.FC<PostFeedProps> = ({ userId }) => {
  const { data: posts = [], isLoading } = usePosts(userId)
  const visible = posts.filter((post: Record<string, any>) => post.active === true)

  if (!isLoading && visible.length === 0) {
    return <p className="card p-6 text-center text-ink-muted">Zatiaľ žiadne príspevky.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {visible.map((post: Record<string, any>) => (
        <PostItem userId={userId} key={post.id} data={post} />
      ))}
    </div>
  )
}

export default PostFeed
