'use client'

import { User } from '@prisma/client'

import useActiveList from '@/hooks/useActiveList'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ably } from '@/libs/ably'

interface AvatarProps {
  user?: User
}

const AvatarChat: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList()
  //let members = []
  //let isActive
  const isActive = members.indexOf(user?.email!) !== -1
  console.log(members, isActive)
  //let isActive = members.includes(user?.email)
  const channel = ably.channels.get('chatroom')
  // useEffect(() => {
  //   const subscribeToPresence = async () => {
  //     await channel.presence.subscribe((presenceMessage) => {
  //       const { action, clientId } = presenceMessage
  //       console.log('Presence update:', action, 'from:', clientId)
  //     })
  //     // Update the list of channel members when the presence set changes
  //     const channelMembers = await channel.presence.get()
  //     console.log(channelMembers)
  //     channelMembers.map((member) => {
  //       members.push(member.clientId)
  //       isActive = members.includes(user?.email)

  //       console.log('members', members, isActive, user?.email)
  //       //console.log('uim', user?.email, member.clientId)
  //     })
  //   }

  //   subscribeToPresence()
  // }, [channel, members])

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
        md:h-11 
        md:w-11
      '
      >
        <Image
          style={{
            objectFit: 'cover',
            borderRadius: '100%',
          }}
          fill
          src={user?.profileImage || '/images/placeholder.png'}
          alt='Avatar'
          sizes='150'
        />
      </div>
      {isActive ? (
        <span
          className='
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-1
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
          '
        />
      ) : null}
    </div>
  )
}

export default AvatarChat
