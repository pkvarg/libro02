import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { HiArrowRightOnRectangle, HiOutlineShieldCheck, HiPlus } from 'react-icons/hi2'

import useCurrentUser from '@/hooks/useCurrentUser'
import useBookModal from '@/hooks/useBookModal'
import useLoginModal from '@/hooks/useLoginModal'

import Avatar from '../Avatar'
import SidebarItem from './SidebarItem'
import SidebarLogo from './SidebarLogo'
import { getNavItems, isActivePath } from './navItems'

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser()
  const router = useRouter()
  const bookModal = useBookModal()
  const loginModal = useLoginModal()

  const items = getNavItems(currentUser).filter((item) => !item.auth || currentUser)

  return (
    <aside className="sticky top-0 hidden h-screen w-[72px] shrink-0 flex-col py-4 md:flex lg:w-60">
      <SidebarLogo />
      <nav className="mt-4 flex flex-col gap-1" aria-label="Hlavná navigácia">
        {items.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            auth={item.auth}
            alert={item.alert}
            active={isActivePath(router.asPath, item.href)}
          />
        ))}
        {currentUser?.isAdmin && (
          <SidebarItem
            href="/admin"
            icon={HiOutlineShieldCheck}
            label="Admin"
            active={isActivePath(router.asPath, '/admin')}
          />
        )}
      </nav>

      <div className="mt-6">
        {currentUser ? (
          <button
            type="button"
            onClick={bookModal.onOpen}
            className="btn btn-primary btn-lg w-12 px-0 lg:w-full"
            title="Pridať knihu"
          >
            <HiPlus size={20} />
            <span className="hidden lg:inline">Pridať knihu</span>
          </button>
        ) : (
          <button type="button" onClick={loginModal.onOpen} className="btn btn-primary btn-lg w-full px-0 lg:px-6">
            <span className="hidden lg:inline">Prihlásiť sa</span>
            <HiArrowRightOnRectangle size={20} className="lg:hidden" />
          </button>
        )}
      </div>

      {currentUser && (
        <div className="mt-auto flex items-center gap-3 rounded-full p-1.5 lg:pr-2">
          <Avatar userId={currentUser.id} src={currentUser.profileImage ?? null} name={currentUser.name} size="sm" />
          <Link href={`/users/${currentUser.id}`} className="focus-ring hidden min-w-0 flex-1 rounded lg:block">
            <p className="truncate text-sm font-semibold text-ink hover:underline">{currentUser.name}</p>
            <p className="truncate text-xs text-ink-muted">@{currentUser.username}</p>
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="icon-btn hidden lg:inline-flex"
            title="Odhlásiť sa"
            aria-label="Odhlásiť sa"
          >
            <HiArrowRightOnRectangle size={20} />
          </button>
        </div>
      )}
      {currentUser && (
        <button
          type="button"
          onClick={() => signOut()}
          className="icon-btn mt-2 self-center lg:hidden"
          title="Odhlásiť sa"
          aria-label="Odhlásiť sa"
        >
          <HiArrowRightOnRectangle size={20} />
        </button>
      )}
    </aside>
  )
}

export default Sidebar
