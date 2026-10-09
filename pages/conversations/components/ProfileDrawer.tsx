'use client'

import { Fragment, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose, IoTrash } from 'react-icons/io5'
import { Conversation, User } from '@prisma/client'
import Link from 'next/link'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'

import useOtherUser from '@/hooks/useOtherUser'

import Avatar from '@/components/Avatar'
import AvatarGroup from '@/components/AvatarGroup'
import ConfirmModal from './ConfirmModal'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  data: Conversation & {
    users: User[]
  }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const otherUser = useOtherUser(data)

  let title
  let joinedDate

  if (otherUser) {
    joinedDate = useMemo(() => {
      return format(new Date(otherUser.createdAt), 'PP', { locale: sk })
    }, [otherUser.createdAt])

    title = useMemo(() => {
      return data.name || otherUser.name
    }, [data.name, otherUser.name])
  }

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-ink/40' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-sm'>
                    <div className='flex h-full flex-col overflow-y-auto border-l border-line bg-surface py-4 shadow-pop'>
                      <div className='flex justify-end px-4'>
                        <button type='button' className='icon-btn' onClick={onClose}>
                          <span className='sr-only'>Zavrieť</span>
                          <IoClose size={22} aria-hidden='true' />
                        </button>
                      </div>
                      <div className='flex flex-col items-center px-6 pt-2 text-center'>
                        {data?.isGroup ? (
                          <AvatarGroup users={data?.users} />
                        ) : (
                          <Avatar
                            userId={otherUser?.id as string}
                            src={otherUser?.profileImage ?? null}
                            name={otherUser?.name}
                            isLarge
                          />
                        )}
                        <h2 className='mt-3 font-display text-xl font-semibold text-ink'>{title}</h2>
                        {!data?.isGroup && otherUser?.username && (
                          <p className='text-sm text-ink-muted'>@{otherUser.username}</p>
                        )}
                        {!data?.isGroup && otherUser && (
                          <Link href={`/users/${otherUser.id}`} className='btn btn-secondary mt-4'>
                            Zobraziť profil
                          </Link>
                        )}
                      </div>
                      <dl className='mx-6 mt-6 space-y-4 border-t border-line pt-5 text-sm'>
                        {data?.isGroup && (
                          <div>
                            <dt className='font-medium text-ink-muted'>Členovia</dt>
                            <dd className='mt-1 text-ink'>{data?.users.map((user) => user.name).join(', ')}</dd>
                          </div>
                        )}
                        {!data?.isGroup && joinedDate && (
                          <div>
                            <dt className='font-medium text-ink-muted'>Členom od</dt>
                            <dd className='mt-1 text-ink'>
                              <time dateTime={joinedDate}>{joinedDate}</time>
                            </dd>
                          </div>
                        )}
                      </dl>
                      <div className='mx-6 mt-auto pt-6'>
                        <button
                          type='button'
                          onClick={() => setConfirmOpen(true)}
                          className='btn w-full text-danger hover:bg-danger-soft'
                        >
                          <IoTrash size={18} />
                          Vymazať konverzáciu
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ProfileDrawer
