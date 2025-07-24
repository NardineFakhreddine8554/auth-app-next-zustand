'use client'
import { withAuth } from '@/components/withAuth'

function UserDashboardPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl"> USER Dashboard page</h1>
      </div>
    )
  }

  export default withAuth(UserDashboardPage, 'user')