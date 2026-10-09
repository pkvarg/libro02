import type { AppProps } from 'next/app'
import { Inter, Lora } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
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
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })
// Headings: Lora, a classic book serif (Fraunces drew a short, hooked "j").
const lora = Lora({ subsets: ['latin', 'latin-ext'], weight: ['500', '600'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      {/* Fonts are set on :root so modals and dialogs rendered in portals use them too. */}
      <style jsx global>{`
        :root {
          --font-sans: ${inter.style.fontFamily};
          --font-display: ${lora.style.fontFamily};
        }
      `}</style>
      <RegisterModal />
      <LoginModal />
      <ForgotPasswordModal />
      <ResetPasswordModal />
      <RegistrationLinkModal />
      <EditModal />
      <BookModal />
      <EditBookModal />
      <Layout>
        <Component {...pageProps} />
        <Footer />
      </Layout>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#292524',
            color: '#FAF7F2',
            borderRadius: '999px',
            fontSize: '14px',
            padding: '8px 16px',
          },
        }}
      />
    </SessionProvider>
  )
}
