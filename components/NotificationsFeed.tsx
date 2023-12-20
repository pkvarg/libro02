import { FaBookReader } from 'react-icons/fa'

import useNotifications from '@/hooks/useNotifications'
import useCurrentUser from '@/hooks/useCurrentUser'
//import { useRouter } from 'next/router'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import Avatar from './Avatar'

const NotificationsFeed = () => {
  // const router = useRouter()

  // const goToUser = useCallback(
  //   (ev: any, user: string) => {
  //     ev.stopPropagation()
  //     router.push(`/users/${user}`)
  //   },
  //   [router]
  // )

  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser()
  const { data: fetchedNotifications = [] } = useNotifications(currentUser?.id)

  useEffect(() => {
    mutateCurrentUser()
  }, [mutateCurrentUser])

  if (fetchedNotifications.length === 0) {
    return (
      <div className='text-neutral-600 text-center p-6 text-xl'>
        Žiadne notifikácie
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      {fetchedNotifications.map((notification: Record<string, any>) => (
        <div
          //onClick={(ev) => goToUser(ev, notification?.liker)}
          key={notification?.id}
          className='flex flex-row items-center px-6 py-2 gap-4 border-b-[1px] border-neutral-800 cursor-pointer'
        >
          {/* <FaBookReader color='white' size={32} /> */}
          <div className='w-10 h-auto'>
            <Avatar userId={notification?.liker} hasBorder={true} />
          </div>

          <p className='text-white'>{notification?.body}</p>
        </div>
      ))}
    </div>
  )
}

export default NotificationsFeed
