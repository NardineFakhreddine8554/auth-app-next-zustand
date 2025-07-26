'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error, user ,fieldErrors} = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 shadow-xl">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
           {fieldErrors && fieldErrors?.email  &&<p className="text-red-500">{fieldErrors.email[0]}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {fieldErrors && fieldErrors.password  &&<p className="text-red-500">{fieldErrors.password[0]}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {user && <p className="text-green-600">Welcome {user?.name} ({user?.role?.name})</p>}
          {user &&user?.role?.name=='admin'&& redirect('/admin-dashboard')}
          {user &&user?.role?.name=='user'&& redirect('/user-dashboard')}
          <p className="mt-4">
  Don't have an account? <a href="/register" className="text-blue-600 underline">Register here</a>
</p>
        </form>
      </CardContent>
    </Card>
  )
}
