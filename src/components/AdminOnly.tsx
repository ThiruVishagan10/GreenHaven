// components/AdminOnly.tsx
"use client"

import { useAdminAuth } from '@/lib/context/AdminAuth';

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
