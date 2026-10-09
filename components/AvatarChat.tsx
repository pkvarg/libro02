'use client'

import { User } from '@prisma/client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ably } from '@/libs/ably'

interface AvatarProps {
  user?: User
}

const AvatarChat: React.FC<AvatarProps> = ({ user }) => {
  let members = []
  const [isActive, setIsActive] = useState<boolean>(false)
  const channel = ably.channels.get('chatroom')
  useEffect(() => {
    const subscribeToPresence = async () => {
      await channel.presence.subscribe((presenceMessage) => {
        const { action, clientId } = presenceMessage
        //  console.log('Presence update:', action, 'from:', clientId)
        if (action === 'leave') {
          //   console.log(clientId, 'left')
          members.filter((member) => member.clientId === clientId)
          setIsActive(members.indexOf(user?.id!) !== 1)
        }
        if (action === 'enter') {
          //  console.log(clientId, 'entered')
          members.push(clientId)
          setIsActive(members.indexOf(user?.id!) !== -1)
        }
      })
      // Update the list of channel members when the presence set changes
      const channelMembers = await channel.presence.get()
      //  console.log(channelMembers)
      channelMembers.map((member) => {
        members.push(member.clientId)
        setIsActive(members.indexOf(user?.id!) !== -1)
      })
    }

    subscribeToPresence()
  }, [channel, members, user?.id])

  return (
    <div className='relative'>
      <div
        className='
        relative 
        inline-block 
        rounded-full 
        overflow-hidden
        h-9
        w-9
        bg-sunken
        md:h-10
        md:w-10
      '
      >
        <Image
          style={{
            objectFit: 'cover',
            borderRadius: '100%',
          }}
          fill
          src={user?.profileImage || '/images/placeholder.png'}
          alt={user?.name ? `Profilová fotka – ${user.name}` : 'Profilová fotka'}
          sizes='150'
        />
      </div>
      {isActive ? (
        <span
          className='
            absolute 
            block 
            rounded-full 
            bg-success
            ring-2
            ring-surface
            bottom-0
            right-0
            h-2.5
            w-2.5
          '
        />
      ) : null}
    </div>
  )
}

export default AvatarChat
