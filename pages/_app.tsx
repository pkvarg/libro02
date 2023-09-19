import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { SocketProvider } from '@/components/providers/SocketProvider'
import Layout from '@/components/Layout'
import LoginModal from '@/components/modals/LoginModal'
import RegisterModal from '@/components/modals/RegisterModal'
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal'
import '@/styles/globals.css'
import EditModal from '@/components/modals/EditModal'
import ResetPasswordModal from '@/components/modals/ResetPasswordModal'
import RegistrationLinkModal from '@/components/modals/RegistrationLinkModal'
import BookModal from '@/components/modals/BookModal'
import EditBookModal from '@/components/modals/EditBookModal'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SocketProvider>
        <RegisterModal />
        <LoginModal />
        <ForgotPasswordModal />
        <ResetPasswordModal />
        <RegistrationLinkModal />
        <EditModal />
        <BookModal />
        <EditBookModal />
        <Layout>
          {/* <ActiveStatus /> */}
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </SocketProvider>
    </SessionProvider>
  )
}
