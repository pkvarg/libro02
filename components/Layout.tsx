import React from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import FollowBar from '@/components/layout/FollowBar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const isChat = router.route.startsWith('/conversations')
  const isWide = isChat || router.route.startsWith('/admin')

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-[1240px] justify-center gap-6 md:px-4 lg:gap-8">
        <Sidebar />
        <main
          className={clsx(
            'min-w-0 flex-1 px-4 md:px-0',
            isWide ? 'max-w-none' : 'max-w-[640px]',
            isChat ? 'pb-0' : 'pb-24 md:pb-8'
          )}
        >
          {children}
        </main>
        {!isWide && <FollowBar />}
      </div>
      {!router.route.startsWith('/conversations/') && <MobileNav />}
    </div>
  )
}

export default Layout
