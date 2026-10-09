'use client'
import React, { useCallback } from 'react'
import { IconType } from 'react-icons'
import Link from 'next/link'
import clsx from 'clsx'

import useLoginModal from '@/hooks/useLoginModal'
import useCurrentUser from '@/hooks/useCurrentUser'

interface SidebarItemProps {
  label: string
  icon: IconType
  href?: string
  onClick?: () => void
  auth?: boolean
  alert?: boolean
  active?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon: Icon, href, auth, onClick, alert, active }) => {
  const loginModal = useLoginModal()
  const { data: currentUser } = useCurrentUser()

  const needsLogin = auth && !currentUser

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (onClick) {
        event.preventDefault()
        return onClick()
      }
      if (needsLogin) {
        event.preventDefault()
        loginModal.onOpen()
      }
    },
    [onClick, needsLogin, loginModal]
  )

  const className = clsx(
    'focus-ring group relative flex h-12 items-center gap-4 rounded-full px-3 text-[17px] transition-colors lg:pr-5',
    active ? 'bg-sunken font-semibold text-ink' : 'text-ink-soft hover:bg-sunken hover:text-ink'
  )

  const content = (
    <>
      <span className="relative flex h-6 w-6 items-center justify-center">
        <Icon size={24} />
        {alert && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-paper" aria-label="Nové" />
        )}
      </span>
      <span className="hidden lg:inline">{label}</span>
    </>
  )

  if (href && !onClick) {
    return (
      <Link href={href} onClick={handleClick} className={className} title={label} aria-current={active ? 'page' : undefined}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={handleClick} className={clsx(className, 'w-full text-left')} title={label}>
      {content}
    </button>
  )
}

export default SidebarItem
