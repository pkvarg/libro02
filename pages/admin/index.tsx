import React, { useEffect } from 'react'
import getCurrentUser from '@/hooks/useCurrentUser'
import { useRouter } from 'next/router'

const AdminPage = () => {
  const { data } = getCurrentUser()
  const router = useRouter()

  const isAdmin = data?.isAdmin

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin])

  return isAdmin && <div>Hello Admin</div>
}

export default AdminPage
