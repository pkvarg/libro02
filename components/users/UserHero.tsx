import Image from 'next/image'

import useUser from '@/hooks/useUser'

import Avatar from '../Avatar'

interface UserHeroProps {
  userId: string
}

const UserHero: React.FC<UserHeroProps> = ({ userId }) => {
  const { data: fetchedUser } = useUser(userId)

  return (
    <div className="relative">
      <div className="relative h-36 overflow-hidden rounded-t-card bg-gradient-to-br from-[#D9C9AE] to-[#8C6A4F] sm:h-48">
        {fetchedUser?.coverImage && (
          <Image src={fetchedUser.coverImage} fill alt="" sizes="640px" style={{ objectFit: 'cover' }} />
        )}
      </div>
      <div className="absolute -bottom-12 left-5 sm:-bottom-16">
        <Avatar
          userId={userId}
          src={fetchedUser?.profileImage ?? null}
          name={fetchedUser?.name}
          isLarge
          hasBorder
          linked={false}
        />
      </div>
    </div>
  )
}

export default UserHero
