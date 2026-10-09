import Link from 'next/link'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'

import useStartConversation from '@/hooks/useStartConversation'
import useCurrentUser from '@/hooks/useCurrentUser'

import Avatar from '../Avatar'
import FollowButton from './FollowButton'

export interface PublicProfile {
  id: string
  name: string
  username: string
  bio?: string | null
  profileImage?: string | null
}

interface UserCardProps {
  user: PublicProfile
  showBio?: boolean
  showFollow?: boolean
  showChat?: boolean
  onNavigate?: () => void
}

// A member row: the whole row opens the profile; buttons sit above the link.
const UserCard: React.FC<UserCardProps> = ({ user, showBio, showFollow, showChat, onNavigate }) => {
  const { data: currentUser } = useCurrentUser()
  const { startConversation, isLoading } = useStartConversation()
  const isSelf = currentUser?.id === user.id

  return (
    <div className="relative flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-sunken">
      <Avatar userId={user.id} src={user.profileImage ?? null} name={user.name} linked={false} />
      <div className="min-w-0 flex-1">
        <Link
          href={`/users/${user.id}`}
          onClick={onNavigate}
          className="focus-ring block rounded after:absolute after:inset-0 after:content-['']"
        >
          <span className="block truncate font-semibold text-ink">{user.name}</span>
          <span className="block truncate text-sm text-ink-muted">@{user.username}</span>
        </Link>
        {showBio && user.bio && <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{user.bio}</p>}
      </div>
      {!isSelf && (showFollow || showChat) && (
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          {showChat && (
            <button
              type="button"
              onClick={() => startConversation(user.id)}
              disabled={isLoading}
              className="icon-btn"
              aria-label={`Napísať správu – ${user.name}`}
              title="Napísať správu"
            >
              <HiOutlineChatBubbleLeftRight size={20} />
            </button>
          )}
          {showFollow && <FollowButton userId={user.id} small />}
        </div>
      )}
    </div>
  )
}

export default UserCard
