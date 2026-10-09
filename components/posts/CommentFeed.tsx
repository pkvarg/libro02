import CommentItem from './CommentItem'

interface CommentFeedProps {
  comments?: Record<string, any>[]
}

const CommentFeed: React.FC<CommentFeedProps> = ({ comments = [] }) => {
  if (comments.length === 0) {
    return null
  }

  return (
    <section className="card mt-3 divide-y divide-line" aria-label="Komentáre">
      {comments.map((comment: Record<string, any>) => (
        <CommentItem key={comment.id} data={comment} />
      ))}
    </section>
  )
}

export default CommentFeed
