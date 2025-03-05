// components/AdminProtectedRoute.tsx
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/context/AdminAuth';
import { UserAuth } from '@/lib/context/AuthContent';
import { CircularProgress } from '@nextui-org/react';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdminAuth();
  const { user } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and admin status is loaded
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAdmin, user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress size="lg" />
      </div>
    );
  }

  // Only render children if user is admin
  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
