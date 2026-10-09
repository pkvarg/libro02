import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import useUser from '@/hooks/useUser'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

interface AvatarProps {
  userId: string
  isLarge?: boolean
  hasBorder?: boolean
  size?: AvatarSize
  // Pass the image when the caller already has it, to skip fetching the user.
  src?: string | null
  name?: string
  linked?: boolean
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6',
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-24 w-24 sm:h-32 sm:w-32',
}

const Avatar: React.FC<AvatarProps> = ({ userId, isLarge, hasBorder, size, src, name, linked = true }) => {
  const { data: fetchedUser } = useUser(src === undefined ? userId : '')

  const image = src === undefined ? fetchedUser?.profileImage : src
  const label = name || fetchedUser?.name
  const className = clsx(
    'relative block shrink-0 overflow-hidden rounded-full bg-sunken',
    sizeClasses[size || (isLarge ? 'lg' : 'md')],
    hasBorder && 'ring-4 ring-surface'
  )

  const img = (
    <Image
      fill
      style={{ objectFit: 'cover' }}
      alt={label ? `Profilová fotka – ${label}` : 'Profilová fotka'}
      src={image || '/images/placeholder.png'}
      sizes={isLarge || size === 'lg' ? '128px' : '48px'}
    />
  )

  if (!linked || !userId) {
    return <span className={className}>{img}</span>
  }

  return (
    <Link
      href={`/users/${userId}`}
      onClick={(event) => event.stopPropagation()}
      className={clsx(className, 'focus-ring transition hover:opacity-90')}
      aria-label={label ? `Profil: ${label}` : 'Profil'}
    >
      {img}
    </Link>
  )
}

export default Avatar
