import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'
import { HiOutlineCalendar, HiOutlineChatBubbleLeftRight, HiOutlinePencilSquare, HiPlus } from 'react-icons/hi2'

import useCurrentUser from '@/hooks/useCurrentUser'
import useUser from '@/hooks/useUser'
import useEditModal from '@/hooks/useEditModal'
import useBookModal from '@/hooks/useBookModal'
import useStartConversation from '@/hooks/useStartConversation'
import { FollowListType } from '@/hooks/useFollows'

import Button from '../Button'
import FollowButton from './FollowButton'
import FollowListModal from './FollowListModal'

interface UserBioProps {
  userId: string
}

const UserBio: React.FC<UserBioProps> = ({ userId }) => {
  const { data: currentUser } = useCurrentUser()
  const { data: fetchedUser } = useUser(userId)

  const editModal = useEditModal()
  const BookModal = useBookModal()
  const { startConversation, isLoading: isStarting } = useStartConversation()

  const [listType, setListType] = useState<FollowListType | undefined>()

  const createdAt = useMemo(() => {
    if (!fetchedUser?.createdAt) {
      return null
    }

    return format(new Date(fetchedUser.createdAt), 'LLLL yyyy', { locale: sk })
  }, [fetchedUser?.createdAt])

  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="px-5 pb-5">
      <div className="flex min-h-[56px] flex-wrap items-start justify-end gap-2 pl-28 pt-3 sm:min-h-[64px] sm:pl-40">
        {isOwnProfile ? (
          <>
            <Button
              secondary
              label="Upraviť profil"
              icon={<HiOutlinePencilSquare size={18} />}
              onClick={editModal.onOpen}
            />
            <Button label="Pridať knihu" icon={<HiPlus size={18} />} onClick={BookModal.onOpen} />
          </>
        ) : (
          <>
            {currentUser && (
              <Button
                secondary
                label="Napísať"
                icon={<HiOutlineChatBubbleLeftRight size={18} />}
                disabled={isStarting}
                onClick={() => startConversation(userId)}
              />
            )}
            <FollowButton userId={userId} />
          </>
        )}
      </div>

      <div className="mt-4 sm:mt-6">
        <h2 className="font-display text-2xl font-semibold text-ink">{fetchedUser?.name}</h2>
        <p className="text-ink-muted">@{fetchedUser?.username}</p>
      </div>
      {fetchedUser?.bio && <p className="mt-3 whitespace-pre-line text-ink">{fetchedUser.bio}</p>}
      {createdAt && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
          <HiOutlineCalendar size={18} />
          Členom od {createdAt}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
        <button
          type="button"
          onClick={() => setListType('following')}
          className="focus-ring -ml-2 rounded-full px-2 py-1.5 hover:bg-sunken"
        >
          <span className="font-semibold text-ink">{fetchedUser?.followingIds?.length || 0}</span>{' '}
          <span className="text-ink-muted">Sledovaných</span>
        </button>
        <button
          type="button"
          onClick={() => setListType('followers')}
          className="focus-ring rounded-full px-2 py-1.5 hover:bg-sunken"
        >
          <span className="font-semibold text-ink">{fetchedUser?.followersCount || 0}</span>{' '}
          <span className="text-ink-muted">Sledujúcich</span>
        </button>
      </div>

      <FollowListModal
        userId={userId}
        type={listType}
        onChangeType={setListType}
        onClose={() => setListType(undefined)}
      />
    </div>
  )
}

export default UserBio
