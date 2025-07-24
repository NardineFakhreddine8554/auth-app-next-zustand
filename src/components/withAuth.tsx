
'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function withAuth(Component: React.ComponentType, requiredRole?: string) {
  return function ProtectedComponent(props: any) {
    const router = useRouter()
    const { token, user } = useAuthStore()

    useEffect(() => {
      if (!token) {
        router.push('/login')
      } else if (requiredRole && user?.role.name !== requiredRole) {
        router.push('/unautorisation')
      }
    }, [token, user, requiredRole, router])

    if (!token || (requiredRole && user?.role.name !== requiredRole)) return null

    return <Component {...props} />
  }
}
