// app/admin/layout.tsx
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase'
import Sidebar from './components/Sidebar'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'
 // You'll need to create this

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login') // Redirect to login page if not authenticated
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    )
  }

  // Only render the admin layout if user is authenticated
  if (!user) {
    return null // or return a loading state
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
        <AdminProtectedRoute>
      <Sidebar />
      <main className="ml-[20%] w-[80%] p-8">
        {children}
      </main>
      </AdminProtectedRoute>
    </div>
  )
}
