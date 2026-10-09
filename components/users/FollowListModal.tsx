import { ClipLoader } from 'react-spinners'
import clsx from 'clsx'

import useFollows, { FollowListType } from '@/hooks/useFollows'

import Modal from '../Modal'
import UserCard, { PublicProfile } from './UserCard'

interface FollowListModalProps {
  userId: string
  type?: FollowListType
  onChangeType: (type: FollowListType) => void
  onClose: () => void
}

const tabs: { type: FollowListType; label: string }[] = [
  { type: 'following', label: 'Sledovaní' },
  { type: 'followers', label: 'Sledujúci' },
]

const FollowListModal: React.FC<FollowListModalProps> = ({ userId, type, onChangeType, onClose }) => {
  const { data: users, isLoading, error } = useFollows(userId, type)

  const body = (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-full bg-sunken p-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            role="tab"
            aria-selected={type === tab.type}
            onClick={() => onChangeType(tab.type)}
            className={clsx(
              'focus-ring flex-1 rounded-full py-2 text-sm font-semibold transition-colors',
              type === tab.type ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center py-8">
          <ClipLoader color="#7C2D3A" size={28} />
        </div>
      )}
      {error && <p className="py-6 text-center text-sm text-ink-muted">Zoznam sa nepodarilo načítať.</p>}
      {users && users.length === 0 && (
        <p className="py-6 text-center text-sm text-ink-muted">
          {type === 'following' ? 'Zatiaľ nikoho nesleduje.' : 'Zatiaľ nemá žiadnych sledujúcich.'}
        </p>
      )}
      {users && users.length > 0 && (
        <div className="-mx-2 flex flex-col">
          {users.map((user: PublicProfile) => (
            <UserCard key={user.id} user={user} showBio showFollow onNavigate={onClose} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Modal
      isOpen={!!type}
      onClose={onClose}
      title={type === 'followers' ? 'Sledujúci' : 'Sledovaní'}
      body={body}
    />
  )
}

export default FollowListModal
