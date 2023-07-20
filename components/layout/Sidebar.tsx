import React from 'react'
import { BsBellFill, BsHouseFill } from 'react-icons/bs'
import { FaUser, FaUserPlus } from 'react-icons/fa'
import { ImUserPlus } from 'react-icons/im'
import { BiLogOut } from 'react-icons/bi'
import SidebarLogo from './SidebarLogo'
import SidebarItem from './SidebarItem'
import SidebarTweetButton from './SidebarTweetButton'
import useCurrentUser from '@/hooks/useCurrentUser'
import { signOut } from 'next-auth/react'

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser()

  const items = [
    {
      label: 'Domov',
      href: '/',
      icon: BsHouseFill,
    },
    {
      label: 'Notifikácie',
      href: '/notifications',
      icon: BsBellFill,
      auth: true,
      alert: currentUser?.hasNotification,
    },
    {
      label: 'Profil',
      href: `/users/${currentUser?.id}`,
      icon: FaUser,
      auth: true,
    },
  ]

  return (
    <div className='col-span-1 h-full pr-4 md:pr-6'>
      <div className='flex flex-col items-end'>
        <div className='space-y-2 lg:w-[230px]'>
          {/* <SidebarLogo /> */}
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              auth={item.auth}
              alert={item.alert}
            />
          ))}
          {currentUser && (
            <>
              <SidebarItem
                onClick={() => signOut()}
                icon={BiLogOut}
                label='Odhlásiť'
              />
              <div className='block lg:hidden text-[30px]'>
                <SidebarItem
                  key='users'
                  href='/users'
                  label='Sledovať'
                  icon={ImUserPlus}
                />
              </div>
            </>
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
