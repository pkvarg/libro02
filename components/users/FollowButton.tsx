import useCurrentUser from '@/hooks/useCurrentUser'
import useFollow from '@/hooks/useFollow'

import Button from '../Button'

interface FollowButtonProps {
  userId: string
  small?: boolean
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, small }) => {
  const { data: currentUser } = useCurrentUser()
  const { isFollowing, toggleFollow, isLoading } = useFollow(userId)

  if (!currentUser || currentUser.id === userId) return null

  return (
    <Button
      onClick={toggleFollow}
      disabled={isLoading}
      small={small}
      label={isFollowing ? 'Sledujete' : 'Sledovať'}
      secondary={isFollowing}
    />
  )
}

export default FollowButton
