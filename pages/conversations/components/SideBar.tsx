import getCurrentUser from '@/actions/getCurrentUser'

import DesktopSidebar from './DesktopSideBar'
import MobileFooter from './MobileFooter'

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()

  return (
    <div className='h-full text-[#ffffff]'>
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className='lg:pl-20 h-full'>{children}</main>
    </div>
  )
}

export default Sidebar
