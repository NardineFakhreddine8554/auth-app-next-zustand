'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token, user } = useAuthStore()
  const isAuthenticated = !!token

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user && user.role.name !== 'user') {
      router.push('/unautorisation')
    }
  }, [isAuthenticated, user, router]) // ✅ Added `user` dependency



  return <>{children}</>
}
