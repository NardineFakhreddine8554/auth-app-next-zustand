'use client';
import { withAuth } from '@/components/withAuth';

function AdminDashboardPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl"> Admin Dashboard page</h1>
      </div>
    )
  }

  export default withAuth(AdminDashboardPage,'admin')